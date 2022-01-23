import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { eventPathProcessor } from '../../shared/src/services/event-processor';
import {
    createErrorResponse,
    createSuccessResponse,
    SUCCESS_MESSAGE
} from '../../shared/src/utilities/response-helpers';
import { getPlayer } from '../../shared/src/models/player';

export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    let body: { id: string };
    try {
        body = eventPathProcessor<typeof body>({
            type: 'object',
            properties: {
                id: { type: 'string' }
            },
            required: ['id'],
            additionalProperties: false
        }, event);
    } catch (err) {
        return createErrorResponse(err);
    }

    try {
        const result = await getPlayer(body.id);
        if (result === null) {
            return createErrorResponse('Provided playerId does not exist.')
        }
        return createSuccessResponse(SUCCESS_MESSAGE, { username: result.username });
    } catch (err) {
        return createErrorResponse(err);
    }
};
