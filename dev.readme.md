
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

# Working with `serverless.yml` 🦄
This is where the magic happens.
## Available scripts 

[`npm run test`](/blob/master/package.json#L7)

## IAM 


## Variabels and ServerLess levels

custom is the top level
env.yml is the external api keys

provider.environment is the level you will include into the current scope

## API
### Creating a new endpoint
### CRUD
### EVENTS
### Handler lib

## Database 
Under normal circumstances a DevOps will have local databases to work on. For this exampel we use an online database. 

For this exampel we use an online database. 

You can spawn new database (only if necessary) using deploy with a custom stage (format: dev-*****).
Hovever, the first time you run deploy-dev, a database on stage dev will be created.

### Creating a new table

## Tests

## Notes

Arn are a aws global refrence to a specific service