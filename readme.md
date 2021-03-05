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


# Creating a `env.yml` 🦄

You will need to create this file yourself. 

⚠️ ⚠️ ⚠️ **You should NEVER commit the `env.yml` file to github!** ⚠️ ⚠️ ⚠️

```yml

# HOW TO USE:
#
# 1 Add environment variables for local development.
# 2 Make sure to not commit this file.

prod:
  testEnv: "This is a test env on production"

default:
  testEnv: "This is a test env on development/catch all"
  awsLocalDynammoAccessKey: "special_acess_key"
  awsLocalDynammoSecretAccessKey: "special_secret_acess_key"
```

# Working with `serverless.yml` 🦄
This is where the magic happens.
## Available scripts 
- [`npm run test`](package.json#L7) Executes evertying that has been wraped in the `function test(:callback)`
- [`npm starts`](package.json#L8) Starts the api locally on port [`:3000`](http://localhost:3000/)
- [`npm run deploy-dev`](package.json#L9) Deploys the API and Database to the development eviroment using the *AWS named profile*

## Getting startet
- [`npm run deploy-dev`](package.json#L9)
- [`npm starts`](package.json#L8)
- Goto [`localhost:3000`](http://localhost:3000/)
- Congratulations 🎉

## IAM Roles
IAM (Identity Acess Management) allows us to restrict and define acess levels on AWS.
IAM Roles are widely used so this can be overwhelming at first sight. However, the scope we are using IAM for in `serverless.yml`, is to our service acess to other services. Fx we want our function to have acess to our database.

We can supposed to only give acess to the services we actually use. Fx in [this example](serverless.yml#L32) we give the function acess to all resourcess, but only the sendTemplatedEmail, within SES. In [this other example](serverless.yml#L45) we only give acess to the `${self:custom.stage}-TestTableArn` table and we only allow our service to do simple CRUD operations with the dynamodb table

### Glossary
- `*` : Select everything [`ses:*`]
- `Effect` : What we want to do [`Allow/Deny`]
- `Action` : The services this statement applies to
- `Arn` : Amazon Resource Name. 
- `Fn::ImportValue` : Returns an output generated form an other stack (Fx from the database schema stack)

## Variabels and Serverless levels

**`serverless.yml/custom`** is used as a top level. Here we will have stages, regions and other global service variabels.

**`env.yml`** should be used for external api keys and other variabels outside the service scope.

**`serverless.yml/provider.environment`** are the service level enviroment variabels. Here we will define the variabels we want to include in this service. *We need to include all the `custom` and `env.yml` variables here.* This might seem as double work, but this gives an security advantages when we have multiple service scopes nested in a service.

## API
### Creating a new endpoint
### CRUD
### EVENTS
### Handler lib

## Database 
*Under normal circumstances a DevOps will have local databases to work on. For this exampel we use an online database. *

For this exampel we use an online database. 

You can spawn new database (only if necessary) using deploy with a custom stage (format: dev-*****).
Hovever, the first time you run deploy-dev, a database on stage dev will be created.

### Creating a new table

## Tests

## Notes

Arn are a aws global refrence to a specific service
