# Serverless Node REST API - Typescript

Author: [GOCO Copenhagen](https://goco.dk/)


![GOCO Gif](documentation/into.gif)


# Prerequisite

#### Engine: `v12.*` / `Erbium`
#### AWS CLI `2`


#### Serverless Framework Core `2.4.0` *Suggested*
#### Plugin: `4.4.3` *Suggested*
#### SDK: `2.3.2` *Suggested*
#### Components: `3.7.2` *Suggested*

You will need to define a **named AWS PROFILE**, with administration rights, using the `aws cli 2`. You can use [this link](https://console.aws.amazon.com/iam/home#/users$new?step=review&accessKey&userNames=devprofile&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAdministratorAccess) to directly create the new profile.

The profile for this example is named `devprofile` and only used in the `package.json`. If you wish to change the name of your local profile you will only need to change the name here and give the profile another name, when you create it on the AWS Console.

# Purpose

This service creates AWS databases and API's the ServerLess framework.

[Serverless](https://www.serverless.com/) is a framework to build unified serverless application in various programming languages and using various service providers.


# Creating a `env.yml` 🤫

You will need to create this file yourself. 

⚠️ ⚠️ ⚠️ **You should NEVER commit the `env.yml` file to github!** ⚠️ ⚠️ ⚠️

```yml
prod:
  testEnv: "This is a test env on production"
  ...

default:
  testEnv: "This is a test env on development/catch all"
  awsLocalDynammoAccessKey: "special_access_key"
  awsLocalDynammoSecretAccessKey: "special_secret_access_key"
  ...
```

Please notice the `awsLocalDynammoAccessKey` and the `awsLocalDynammoSecretAccessKey`. These two variables are used for the local environment (otherwise the local version will not run) and you should define these variables by generating a local dynammodb key. You can use [***this direct link***](https://console.aws.amazon.com/iam/home#/users$new?step=review&accessKey&userNames=aws-local-dev-dynamo-db-key&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAmazonDynamoDBFullAccess) to the specific AWS IAM role.

# Working with [`serverless.yml`](serverless.yml) 🦄
This is where the magic happens.
## Available scripts 
- [`npm run test`](package.json#L7) Executes everything that has been wrapped in the `function test(:callback)`
- [`npm starts`](package.json#L8) Starts the api locally on port [`:3000`](http://localhost:3000/)
- [`npm run deploy-dev`](package.json#L9) Deploys the API to the development environment using the *AWS named profile*
- [`npm run deploy-database-dev`](package.json#L10) Deploys the Database to the development environment using the *AWS named profile*

## Getting started
- Install serverless using [`npm i -g serverless` or equivalent](https://www.serverless.com/framework/docs/getting-started/)
- Create the [`env.yml`](#creating-a-envyml-) file
- [`npm run deploy-database-dev`](package.json#L10)
- [`npm starts`](package.json#L8)
- Goto [`localhost:3000`](http://localhost:3000/)
- Congratulations 🎉 🤩
- You can test if your api works using the `mirror` endpoint in your browser.
- You can also test if your connection to the database works, using the `createandlist/{id}` endpoint in your browser.(Notice you should use a number as id reference)

## IAM Roles
IAM (Identity Access Management) allows us to restrict and define access levels on AWS.
IAM Roles are widely used so this can be overwhelming at first sight. However, the scope we are using IAM for in `serverless.yml`, is to our service access to other services. Fx we want our function to have access to our database.

We are supposed to only give access to the services we actually use. Fx in [this example](serverless.yml#L32) we give the function access to all resources, but only the sendTemplatedEmail, within SES. In [this other example](serverless.yml#L45) we only give access to the `${self:custom.stage}-TestTableArn` table and we only allow our service to do simple CRUD operations with the dynamodb table

### Glossary
- [`*`](serverless.yml#L34) : Select everything [`ses:*`](serverless.yml#L31)
- [`Effect`](serverless.yml#L29) : What we want to do [`Allow/Deny`](serverless.yml#L29)
- [`Action`](serverless.yml#L30) : The services this statement applies to. Fx [`dynamodb:DescribeTable`](serverless.yml#L37)
- [`Arn`](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) : Amazon Resource Name. 
- [`Fn::ImportValue`](serverless.yml#L46) : Returns an output generated from another stack (Fx from the database schema stack)

## Variables and Serverless levels

[**`serverless.yml/custom`**](serverless.yml#L8) is used as a top level. Here we will have stages, regions and other global service variables.

[**`env.yml`**](#creating-a-envyml-) should be used for external api keys and other variables outside the service scope.

[**`serverless.yml/provider.environment`**](serverless.yml#L18) are the service level environment variables. Here we will define the variables we want to include in this service. *We need to include all the `custom` and `env.yml` variables here.* This might seem as double work, but this gives security advantages when we have multiple service scopes nested in a service.

## API
This serverless frameworks will build a REST Https API Service and after your first deploy, this service will be fully available via a AWS-domain.

The API is a subset of functions, which can be available through our custom routes. We define our [functions in the `serverless.yml`](serverless.yml#L48).

All functions must have a [name](serverless.yml#L60), which is used as a reference on the [CloudWatch-](https://aws.amazon.com/cloudwatch/) and [Lambda](https://aws.amazon.com/lambda/) console. 

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
The handler is the path of the function we will execute. please notice the `main` in this example. Usually you will use names as `get`, `create` or `update`.
Please remember it is possible to export multiple functions in the same file. This will be specified in the CRUD part.

### Events
Event's are the triggers to specific functions. 

When creating a REST API we will usually use the `http` reference, nested with HTTP Methods and paths to define the route for this endpoint.

You can also use the `schedule` reference to run a cron job or [any of these event types](https://www.serverless.com/framework/docs/providers/aws/events/).

### Creating a new endpoint

This boilerplate implements a Handler Library which all functions should be wrapped in. This gives a great level of consistency. 

```node

import { Context, APIGatewayEvent } from "aws-lambda";
import handler from "libs/handler-lib";
import { YOUR_RESPONSE_TYPE } from "./responeTypes";

export const get = handler(async (event: APIGatewayEvent, context: Context): Promise<YOUR_RESPONSE_TYPE> => {
  // YOUR LOGIC GOES HERE
  return ({ ... })
})
```

You should replace `YOUR_RESPONSE_TYPE` with your own response type based on whatever project you are working on.


### CRUD
***TBA SOON***

### Authentication
***TBA SOON***

## Database 
***WORK IN PROGRESS***

* Under normal circumstances a DevOps will have local databases to work on. For this example we use an online database. *

For this example we use an online database. 

You can spawn new database (only if necessary) using deploy with a custom stage (format: dev-*****).
However, the first time you run deploy-dev, a database on stage dev will be created.

### Creating a new table
***TBA SOON***

## Tests
***TBA SOON***
