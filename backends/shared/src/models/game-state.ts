import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { randomUUID } from 'crypto';

const docClient = new DocumentClient({
    endpoint: 'http://docker.for.mac.localhost:8000',
});

export enum Players {
    PlayerOne,
    PlayerTwo,
}

export enum SessionStates {
    Playing,
    Win,
    Draw,
}

export enum SquareStates {
    Empty,
    Circle,
    Cross,
}

export type BoardRow = [SquareStates, SquareStates, SquareStates];

export type Board = [BoardRow, BoardRow, BoardRow];

export interface GameStateResult {
    id: string;
    playerOne: string;
    playerTwo: string | null;
    state: {
        currentPlayer: Players;
        sessionState: SessionStates;
        board: Board;
        movesMade: number;
    };
}

function createBoard(): Board {
    return [
        [SquareStates.Empty, SquareStates.Empty, SquareStates.Empty],
        [SquareStates.Empty, SquareStates.Empty, SquareStates.Empty],
        [SquareStates.Empty, SquareStates.Empty, SquareStates.Empty],
    ];
}

export const getGame = async (
    gameStateId: string
): Promise<GameStateResult | null> => {
    const { Item: result } = await docClient.get({
        TableName: 'gameState',
        Key: { 'id': gameStateId },
    }).promise();

    if (result === undefined) {
        return null;
    }

    return {
        id: result.id,
        playerOne: result.playerOne,
        playerTwo: result.playerTwo,
        state: result.state,
    };
};

export const createGame = async (
    playerId: string,
): Promise<GameStateResult> => {
    const gameStateId = randomUUID();
    const gameState = {
        currentPlayer: Players.PlayerOne,
        sessionState: SessionStates.Playing,
        board: createBoard(),
        movesMade: 0,
    };

    await docClient.put({
        TableName: 'gameState',
        Item: {
            id: gameStateId,
            playerOne: playerId,
            playerTwo: null,
            state: gameState
        },
    }).promise();

    return {
        id: gameStateId,
        playerOne: playerId,
        playerTwo: null,
        state: gameState,
    };
};

export const addPlayer = async (
    gameStateId: string,
    playerId: string,
): Promise<GameStateResult> => {
    const { Attributes: result } = await docClient.update({
        TableName: 'gameState',
        Key: { id: gameStateId },
        UpdateExpression: 'set playerTwo = :p',
        ExpressionAttributeValues: {
            ':p': playerId
        },
        ReturnValues: 'ALL_NEW',
    }).promise();

    if (result === undefined) {
        throw new Error('IMPOSSIBLE!');
    }

    return {
        id: result.id,
        playerOne: result.playerOne,
        playerTwo: result.playerTwo,
        state: result.state,
    };
};

export const updateState = async (
    gameStateId: string,
    state: GameStateResult['state'],
): Promise<GameStateResult> => {
    const { Attributes: result } = await docClient.update({
        TableName: 'gameState',
        Key: { id: gameStateId },
        UpdateExpression: 'set #s = :s',
        ExpressionAttributeNames: {
            '#s': 'state',
        },
        ExpressionAttributeValues: {
            ':s': state
        },
        ReturnValues: 'ALL_NEW',
    }).promise();

    if (result === undefined) {
        throw new Error('IMPOSSIBLE!');
    }

    return {
        id: result.id,
        playerOne: result.playerOne,
        playerTwo: result.playerTwo,
        state: result.state,
    };
};