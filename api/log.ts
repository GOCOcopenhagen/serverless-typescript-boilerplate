import { APIGatewayEvent } from "aws-lambda";
import dynamodbLib from "libs/dynamodb-lib";
import handler from "libs/handler-lib";
import { YOUR_RESPONSE_TYPE } from "libs/responeTypes";
import { v4 as id } from "uuid";

export const createAndList = handler(async (event: APIGatewayEvent): Promise<YOUR_RESPONSE_TYPE> => {
    const n = Number(event.pathParameters.id);
    if (isNaN(n)) throw new Error(n.toString());
    await dynamodbLib.put({
        TableName: process.env.LOG_TABLE_NAME,
        Item: {
            id: id(),
            someNumber: n
        }
    })

    const result = await dynamodbLib.scan({
        TableName: process.env.LOG_TABLE_NAME
    })
    return result;
})
