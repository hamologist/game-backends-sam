import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { eventPathProcessor } from '../../shared/src/services/event-processor';
import {
    createErrorResponse,
    createSuccessResponse,
    SUCCESS_MESSAGE
} from '../../shared/src/utilities/response-helpers';
import { getGame } from '../../shared/src/models/game-state';

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
        const gameState = await getGame(body.id);
        if (gameState === null) {
            return createErrorResponse('Provided gameStateId does not exist.')
        }
        return createSuccessResponse(SUCCESS_MESSAGE, { gameState });
    } catch (err) {
        return createErrorResponse(err);
    }
};
