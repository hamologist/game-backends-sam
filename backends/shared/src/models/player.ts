import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { randomBytes, randomUUID } from 'crypto';

const docClient = new DocumentClient({
    endpoint: 'http://docker.for.mac.localhost:8000',
});

export interface PlayerResult {
    id: string;
    secret: string;
    username: string;
}

export const createPlayer = async (
    username: string
): Promise<PlayerResult> => {
    const playerId = randomUUID();
    const playerSecret = randomBytes(20).toString('hex');

    await docClient.put({
        TableName: 'player',
        Item: {
            'id': playerId,
            'secret': playerSecret,
            'username': username,
        },
    }).promise();

    return {
        id: playerId,
        secret: playerSecret,
        username,
    }
};

export const getPlayer = async (
    playerId: string
): Promise<PlayerResult | null> => {
    const result = await docClient.get({
        TableName: 'player',
        Key: {
            'id': playerId,
        },
    }).promise();

    if (result.Item === undefined) {
        return null;
    }

    return {
        id: result.Item.id,
        secret: result.Item.secret,
        username: result.Item.username,
    };
}
