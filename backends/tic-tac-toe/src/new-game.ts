import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { eventProcessor } from '../../shared/src/services/event-processor';
import {
    createErrorResponse,
    createSuccessResponse, SUCCESS_MESSAGE
} from '../../shared/src/utilities/response-helpers';
import { createGame } from '../../shared/src/services/game-state-mutator';

export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    let body: { playerId: string, playerSecret: string };
    try {
        body = eventProcessor<typeof body>({
            type: 'object',
            properties: {
                playerId: { type: 'string' },
                playerSecret: { type: 'string' },
            },
            required: ['playerId', 'playerSecret'],
            additionalProperties: false
        }, event);
    } catch (err) {
        return createErrorResponse(err);
    }

    try {
        const { id: gameStateId } = await createGame(body.playerId, body.playerSecret);
        return createSuccessResponse(SUCCESS_MESSAGE, { gameStateId })
    } catch (err) {
        return createErrorResponse(err);
    }
}
