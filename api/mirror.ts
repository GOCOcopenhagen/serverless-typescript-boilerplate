import { Context, APIGatewayEvent } from "aws-lambda";
import handler from "libs/handler-lib";
import { YOUR_RESPONSE_TYPE } from "libs/responeTypes";

export const main = handler(async (event: APIGatewayEvent, context: Context): Promise<YOUR_RESPONSE_TYPE> => {
  return ({
    message: "Go GOCO Serverless Boilerplate. Your function executed successfully!. Local vaiable: "+process.env.SAMPLE_ENV_VAR,
    context,
    event,
  })
})