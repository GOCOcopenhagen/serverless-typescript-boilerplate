import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Config } from "aws-sdk"

var config = {}

if(process.env.IS_OFFLINE){
    config = new Config({
        credentials: {
            accessKeyId: process.env.awsLocalDynammoAccessKey,
            secretAccessKey: process.env.awsLocalDynammoSecretAccessKey,

        }, 
        region: 'eu-west-1'
      });
}

const client: DocumentClient = new DocumentClient(config);


export default {
    get: (params: DocumentClient.GetItemInput): Promise<DocumentClient.GetItemOutput> => client.get(params).promise(),
    put: (params: DocumentClient.PutItemInput): Promise<DocumentClient.PutItemOutput> => client.put(params).promise(),
    query: (params: DocumentClient.QueryInput): Promise<DocumentClient.QueryOutput> => client.query(params).promise(),
    update: (params: DocumentClient.UpdateItemInput): Promise<DocumentClient.UpdateItemOutput> => client.update(params).promise(),
    delete: (params: DocumentClient.DeleteItemInput): Promise<DocumentClient.DeleteItemOutput> => client.delete(params).promise(),
    scan: (params: DocumentClient.ScanInput): Promise<DocumentClient.ScanOutput> => client.scan(params).promise()
};