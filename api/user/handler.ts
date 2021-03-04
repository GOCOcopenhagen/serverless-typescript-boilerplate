import { APIGatewayEvent } from "aws-lambda";
import dynamodbLib from "libs/dynamodb-lib";
import handler from "libs/handler-lib";
import { response } from "libs/responeTypes";
import { v4 as id } from "uuid";

export const get = handler(async (event: APIGatewayEvent): Promise<response> => {
    const n = Number(event.pathParameters.id);
    if (isNaN(n)) throw new Error(n.toString());
    await dynamodbLib.put({
        TableName: process.env.TEST_TABLE_NAME,
        Item: {
            id: id(),
            someNumber: n
        }
    })

    const result = await dynamodbLib.scan({
        TableName: process.env.TEST_TABLE_NAME
    })
    return result;
})
