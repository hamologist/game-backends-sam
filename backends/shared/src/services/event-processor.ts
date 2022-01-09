import AJV, { ErrorObject, JSONSchemaType } from 'ajv';
import { APIGatewayProxyEvent } from 'aws-lambda';

const ajv = new AJV();

export class EventProcessorError extends Error {
    constructor(message: string) {
        super(message);
    }

    public static requiredFieldsAreMissing<T>(
        { required }: JSONSchemaType<T>
    ): EventProcessorError {
        let fields = '';

        if (required.length === 1) {
            fields = required[0];
        } else {
            fields = `${required.slice(0, -1).join(', ')} and ${required[required.length - 1]}`;
        }

        return new EventProcessorError(
            `Request is missing the following required fields: ${fields}`
        );
    }
}

/**
 * @throws {EventProcessorError}
 */
export const eventProcessor = <T>(
    schema: JSONSchemaType<T>,
    { body }: APIGatewayProxyEvent,
): T => {
    if (body === null) {
        throw EventProcessorError.requiredFieldsAreMissing(schema);
    }

    const validate = ajv.compile(schema);

    let result: T;
    try {
        result = JSON.parse(body);
    } catch (err) {
        throw new EventProcessorError(`JSON parse error: ${err}`);
    }

    if (!validate(result)) {
        throw new EventProcessorError(validate.errors!.join(', '));
    }

    return result;
}
