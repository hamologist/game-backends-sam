import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { randomBytes, randomUUID } from 'crypto';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
export const lambdaHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {

    if (event.body === null) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'A username must be provided to this request.'
            })
        };
    }

    let body: { username: string };
    try {
        body = JSON.parse(event.body);

        if (body.username === undefined) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'A username must be provided to this request.'
                })
            };
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err
            })
        };
    }

    const playerId = randomUUID();
    const playerSecret = randomBytes(20).toString('hex');
    const params: DocumentClient.PutItemInput = {
        TableName: 'Players',
        Item: {
            'Id': playerId,
            'Secret': playerSecret,
            'Username': body.username,
        },
    }

    const docClient = new DocumentClient({
        endpoint: 'http://docker.for.mac.localhost:8000',
    });
    try {
        await docClient.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success',
                playerId,
                playerSecret
            })
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: err
            })
        };
    }
};
