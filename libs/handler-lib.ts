import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { YOUR_RESPONSE_TYPE } from "./responeTypes";

export default function handler(lambda: (event: APIGatewayEvent, context: Context) => Promise<YOUR_RESPONSE_TYPE>) {
    return async function (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
        try {
            const responseBody = await lambda(event, context);
            return ({
                statusCode: 200,
                body: JSON.stringify(responseBody),
            })
        } catch (e) {
            return ({
                statusCode: 500,
                body: JSON.stringify({error: e.message}),
            })
        }
    };
}