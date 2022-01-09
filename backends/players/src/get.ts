import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { eventProcessor } from '../../shared/src/services/event-processor';
import {
    createErrorResponse,
    createSuccessResponse,
    SUCCESS_MESSAGE
} from '../../shared/src/utilities/response-helpers';
import { getPlayer } from '../../shared/src/models/players';

export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    let body: { playerId: string };
    try {
        body = eventProcessor<typeof body>({
            type: 'object',
            properties: {
                playerId: { type: 'string' }
            },
            required: ['playerId'],
            additionalProperties: false
        }, event);
    } catch (err) {
        return createErrorResponse(err);
    }

    try {
        const result = await getPlayer(body.playerId);
        if (result === null) {
            return createErrorResponse('Provided playerId does not exist.')
        }
        return createSuccessResponse(SUCCESS_MESSAGE, { username: result.username });
    } catch (err) {
        return createErrorResponse(err);
    }
};
