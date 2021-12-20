import { lambdaHandler } from '../app';
import { APIGatewayProxyEvent } from 'aws-lambda';

let event: APIGatewayProxyEvent;

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const result = await lambdaHandler(event);

        expect(result).toBeInstanceOf(Object);
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(expect.any(String));

        let response = JSON.parse(result.body);

        expect(response).toBeInstanceOf(Object);
        expect(response.message).toEqual("hello world!!!");
    });
});
