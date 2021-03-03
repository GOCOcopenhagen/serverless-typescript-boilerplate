import {APIGatewayEvent, Context} from "aws-lambda";
import { main } from "../api/mirror";

test("mirror", async () => {
  const event = { body: "Test Body" } as APIGatewayEvent;
  const context = {} as Context;

  const response = await main(event, context);

  expect(response.statusCode).toEqual(200);
  expect(typeof response.body).toBe("string");
});
