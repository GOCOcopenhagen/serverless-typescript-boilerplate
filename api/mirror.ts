import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export async function main(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v2.0! Your function executed successfully!. Local vaiable: "+process.env.SAMPLE_ENV_VAR,
      context,
      event,
    }),
  };
}
