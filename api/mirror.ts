import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import handler from "libs/handler-lib";
import { response } from "libs/responeTypes";


export const get = handler(async (event: APIGatewayEvent, context: Context): Promise<response> => {
  return ({
    message: "Go Serverless v2.0! Your function executed successfully!. Local vaiable: "+process.env.SAMPLE_ENV_VAR,
    context,
    event,
  })
})