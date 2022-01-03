import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { eventProcessor } from './services/event-processor';
import { createErrorResponse, createSuccessResponse } from './utilities/response-helpers';
import { getPlayer } from './models/players';

export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    let body: { playerId: string, playerSecret: string };
    try {
        body = eventProcessor<typeof body>({
            type: 'object',
            properties: {
                playerId: { type: 'string' },
                playerSecret: { type: 'string'},
            },
            required: ['playerId', 'playerSecret'],
            additionalProperties: false
        }, event);
    } catch (err) {
        return createErrorResponse(err);
    }

    try {
        const result = await getPlayer(body.playerId);
        if (result === null || result.secret !== body.playerSecret) {
            return createSuccessResponse('Invalid')
        }
        return createSuccessResponse('Valid');
    } catch (err) {
        return createErrorResponse(err);
    }
};
