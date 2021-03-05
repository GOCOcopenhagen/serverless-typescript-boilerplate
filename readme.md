# Serverless Node REST API - Typescript

Author: [GOCO Copenhagen](https://goco.dk/)


![GOCO Gif](documentation/into.gif)


# Prerequisite

#### Engine: `v12.*` / `Erbium`
#### AWS CLI `2`


#### Serverless Framework Core `2.4.0` *Sugested*
#### Plugin: `4.4.3` *Sugested*
#### SDK: `2.3.2` *Sugested*
#### Components: `3.7.2` *Sugested*

You will need to define a **named AWS PROFILE**, with administration rights, using the `aws cli 2`. You can use [this link](https://console.aws.amazon.com/iam/home#/users$new?step=review&accessKey&userNames=devprofile&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAdministratorAccess) to directly create the new profile.

The profile for this example is named `devprofile` and only used in the `package.json`. If you wish to change the name of your local profile you will only need to change the name here and give the profile another name, when you create it on the AWS Console.

# Purpose

This service creates AWS databases and API's the ServerLess framework.

[Serverless](https://www.serverless.com/) is a framework to build unified serverless aplication in various programming languages and using varios providers.


# Creating a `env.yml` 🤫

You will need to create this file yourself. 

⚠️ ⚠️ ⚠️ **You should NEVER commit the `env.yml` file to github!** ⚠️ ⚠️ ⚠️

```yml
prod:
  testEnv: "This is a test env on production"
  ...

default:
  testEnv: "This is a test env on development/catch all"
  awsLocalDynammoAccessKey: "special_acess_key"
  awsLocalDynammoSecretAccessKey: "special_secret_acess_key"
  ...
```

Please notice the `awsLocalDynammoAccessKey` and the `awsLocalDynammoSecretAccessKey`. These two variabels are used for the local enviroment (otherwise it the local version will not runn) and you should define these variabels by generating a local dynammo db key. You can use [***this direct link***](https://console.aws.amazon.com/iam/home#/users$new?step=review&accessKey&userNames=aws-local-dev-dynamo-db-key&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAmazonDynamoDBFullAccess) to the specific AWS IAM role.

# Working with [`serverless.yml`](serverless.yml) 🦄
This is where the magic happens.
## Available scripts 
- [`npm run test`](package.json#L7) Executes evertying that has been wraped in the `function test(:callback)`
- [`npm starts`](package.json#L8) Starts the api locally on port [`:3000`](http://localhost:3000/)
- [`npm run deploy-dev`](package.json#L9) Deploys the API and Database to the development eviroment using the *AWS named profile*

## Getting startet
- Install serverless using [`npm i -g serverless` or equvilant](https://www.serverless.com/framework/docs/getting-started/)
- Create the [`env.yml`](#creating-a-envyml-) file
- [`npm run deploy-dev`](package.json#L9)
- [`npm starts`](package.json#L8)
- Goto [`localhost:3000`](http://localhost:3000/)
- Congratulations 🎉 🤩
- You can test if your api works using the `mirror` endpoint in your browser.
- You can also test if your connection to the database works, using the `createandlist/{id}` endpoint in your browser.(Notice you should use a number as id refrence)

## IAM Roles
IAM (Identity Acess Management) allows us to restrict and define acess levels on AWS.
IAM Roles are widely used so this can be overwhelming at first sight. However, the scope we are using IAM for in `serverless.yml`, is to our service acess to other services. Fx we want our function to have acess to our database.

We can supposed to only give acess to the services we actually use. Fx in [this example](serverless.yml#L32) we give the function acess to all resourcess, but only the sendTemplatedEmail, within SES. In [this other example](serverless.yml#L45) we only give acess to the `${self:custom.stage}-TestTableArn` table and we only allow our service to do simple CRUD operations with the dynamodb table

### Glossary
- [`*`](serverless.yml#L34) : Select everything [`ses:*`](serverless.yml#L31)
- [`Effect`](serverless.yml#L29) : What we want to do [`Allow/Deny`](serverless.yml#L29)
- [`Action`](serverless.yml#L30) : The services this statement applies to. Fx [`dynamodb:DescribeTable`](serverless.yml#L37)
- [`Arn`](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) : Amazon Resource Name. 
- [`Fn::ImportValue`](serverless.yml#L46) : Returns an output generated form an other stack (Fx from the database schema stack)

## Variabels and Serverless levels

[**`serverless.yml/custom`**](serverless.yml#L8) is used as a top level. Here we will have stages, regions and other global service variabels.

[**`env.yml`**](#creating-a-envyml-) should be used for external api keys and other variabels outside the service scope.

[**`serverless.yml/provider.environment`**](serverless.yml#L18) are the service level enviroment variabels. Here we will define the variabels we want to include in this service. *We need to include all the `custom` and `env.yml` variables here.* This might seem as double work, but this gives an security advantages when we have multiple service scopes nested in a service.

## API
This serverless frameworks will build a REST Https API Service and after your first deploy, this serivce will be fully available via a AWS-domain.

The API is a subset of functions, which can be availabe through our custom routes. We define our [functions in the `serverless.yml`](serverless.yml#L48).

All functions must have a [name](serverless.yml#L60), which is used as a refrence on the [CloudWatch-](https://aws.amazon.com/cloudwatch/) and [Lambda](https://aws.amazon.com/lambda/) console. 

**Example from [`serverless.yml`](serverless.yml)**
```yml
  mirror:
    handler: api/mirror.main
    events:
      - http:
          path: mirror
          method: get
      - http:
          path: mirror
          method: put
      - schedule:
          rate: rate(24 hours)
```

### Handler
The handler is the path of the function we will execute. please notice the `main` in this example. Usally you will use names as `get`, `create` or `update`.
Please remember it is possible to export multiple functions in the same file. This will be specified in the CRUD part.

### Events
Event's are the triggers to specific functions. 

When creating a REST API we will usally use the `http` refrence, nested with HTTP Methods and paths to define the route for this endpoint.

You can fx also use the `schedule` refrence to run a cron job or [any of these event types](https://www.serverless.com/framework/docs/providers/aws/events/).

### Creating a new endpoint

This boilerplate implements a Handler Libary which all functions should be wrapped in. This gives a great level of consistency. 

```node

import { Context, APIGatewayEvent } from "aws-lambda";
import handler from "libs/handler-lib";
import { YOUR_RESPONSE_TYPE } from "./responeTypes";

export const get = handler(async (event: APIGatewayEvent, context: Context): Promise<YOUR_RESPONSE_TYPE> => {
  // YOUR LOGIC GOES HERE
  return ({ ... })
})
```

You should replace `YOUR_RESPONSE_TYPE` with your own response type based on whatever project you are woking on.


### CRUD
***TBA SOON***

### Authentication
***TBA SOON***

## Database 
***WORK IN PROGRESS***

* Under normal circumstances a DevOps will have local databases to work on. For this exampel we use an online database. *

For this exampel we use an online database. 

You can spawn new database (only if necessary) using deploy with a custom stage (format: dev-*****).
Hovever, the first time you run deploy-dev, a database on stage dev will be created.

### Creating a new table
***TBA SOON***

## Tests
***TBA SOON***

## Notes

Arn are a aws global refrence to a specific service
