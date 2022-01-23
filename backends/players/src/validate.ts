import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { eventBodyProcessor } from '../../shared/src/services/event-processor';
import {
    createErrorResponse,
    createSuccessResponse
} from '../../shared/src/utilities/response-helpers';
import { playerValidator } from '../../shared/src/services/player-validator';

export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    let body: { playerId: string, playerSecret: string };
    try {
        body = eventBodyProcessor<typeof body>({
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
        if (!await playerValidator(body.playerId, body.playerSecret)) {
            return createSuccessResponse('Invalid')
        }
        return createSuccessResponse('Valid');
    } catch (err) {
        return createErrorResponse(err);
    }
};
