import { APIGatewayEvent } from "aws-lambda";
import handler from "libs/handler-lib";
import { response } from "libs/responeTypes";

export const get = handler(async (event: APIGatewayEvent): Promise<response> => {
    const n = Number(event.pathParameters.id);
    if (isNaN(n)) throw new Error(n.toString());
    return process.env.MESSAGE;
})
