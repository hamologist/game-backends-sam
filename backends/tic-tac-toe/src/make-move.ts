import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { eventBodyProcessor } from '../../shared/src/services/event-processor';
import {
    createErrorResponse,
    createSuccessResponse,
    SUCCESS_MESSAGE
} from '../../shared/src/utilities/response-helpers';
import { makeMove } from '../../shared/src/services/game-state-mutator';

export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    let body: {
        gameStateId: string,
        playerId: string,
        playerSecret: string,
        cord: { x: number, y: number },
    };
    try {
        body = eventBodyProcessor<typeof body>({
            type: 'object',
            properties: {
                gameStateId: { type: 'string' },
                playerId: { type: 'string' },
                playerSecret: { type: 'string' },
                cord: {
                    type: 'object',
                    properties: {
                        x: {type: 'number'},
                        y: {type: 'number'},
                    },
                    required: ['x', 'y'],
                },
            },
            required: ['gameStateId', 'playerId', 'playerSecret', 'cord'],
            additionalProperties: false
        }, event);
    } catch (err) {
        return createErrorResponse(err);
    }

    try {
        const gameState = await makeMove(
            body.gameStateId,
            body.playerId,
            body.playerSecret,
            body.cord,
        );
        return createSuccessResponse(SUCCESS_MESSAGE, { gameState });
    } catch (err) {
        return createErrorResponse(err);
    }
};
