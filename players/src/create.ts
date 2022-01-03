import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { eventProcessor } from './services/event-processor';
import { createPlayer } from './models/players';
import {
    createErrorResponse,
    createSuccessResponse,
    SUCCESS_MESSAGE
} from './utilities/response-helpers';

export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    let body: { username: string };
    try {
        body = eventProcessor<typeof body>({
            type: 'object',
            properties: {
                username: { type: 'string' }
            },
            required: ['username'],
            additionalProperties: false
        }, event);
    } catch (err) {
        return createErrorResponse(err);
    }

    try {
        const { id: playerId, secret: playerSecret } = await createPlayer(body.username)
        return createSuccessResponse(SUCCESS_MESSAGE, { playerId, playerSecret });
    } catch(err) {
        return createErrorResponse(err);
    }
};
