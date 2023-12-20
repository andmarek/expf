import * as uuid from "uuid";
import { DynamoDBClient, PutItemCommand, UpdateItemCommand, UpdateItemCommandInput } from "@aws-sdk/client-dynamodb";
import { NextApiRequest, NextApiResponse } from "next";

const ddb = new DynamoDBClient({});

async function appendToList(tableName: string, primaryKey: { [key: string]: any }, listAttributeName: string, newValue: any) {
  const updateParams: UpdateItemCommandInput = {
    TableName: tableName,
    Key: primaryKey,
    UpdateExpression: `SET #listAttr = list_append(#listAttr, :newVal)`,
    ExpressionAttributeNames: {
      '#listAttr': listAttributeName,
    },
    ExpressionAttributeValues: {
      ':newVal': { L: [ { S: newValue } ] },
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const response = await ddb.send(new UpdateItemCommand(updateParams));
    console.log('UpdateItem response:', response);
    return response;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
}

export async function PUT(request: Request) {
  //const commentBody = request.body.commentBody;
  //const boardName = request.body.boardName;




  try {
    const dynamoResponse = await appendToList("expf-board", );

  } catch (error) {
    console.log("Error idk why")
    throw error;
  }
}
