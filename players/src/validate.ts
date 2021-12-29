import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

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

    let body: { playerId: string, playerSecret: string };
    try {
        body = JSON.parse(event.body);

        if (body.playerId === undefined) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'A playerId must be provided to this request.'
                })
            };
        } else if (body.playerSecret === undefined) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    message: 'A playerSecret must be provided to this request.'
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

    const params: DocumentClient.GetItemInput = {
        TableName: 'Players',
        Key: {
            'Id': body.playerId
        }
    }

    const docClient = new DocumentClient({
        endpoint: 'http://docker.for.mac.localhost:8000',
    });
    try {
        const result = await docClient.get(params).promise();

        if (result.Item === undefined || result.Item.Secret !== body.playerSecret) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'Invalid'
                })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Valid',
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
