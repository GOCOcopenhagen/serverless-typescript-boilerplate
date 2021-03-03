import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { response } from "./responeTypes";

export default function handler(lambda: (event: APIGatewayEvent, context: Context) => Promise<response>) {
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