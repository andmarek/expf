import { clerkClient } from '@clerk/nextjs';

import * as uuid from "uuid";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { get } from 'http';

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

const tableName = process.env.BOARDS_DYNAMODB_TABLE;

export async function GET() {
  const command = new ScanCommand({ 
    TableName: tableName as string,
  });

  const response = await docClient.send(command);

  return Response.json(response);
}
