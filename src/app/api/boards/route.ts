import { clerkClient } from '@clerk/nextjs';

import * as uuid from "uuid";
import { DynamoDBClient, DescribeTableCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

const tableName = process.env.BOARDS_DYNAMODB_TABLE;

export async function GET(req: Request) {
  const data = await req.json();

  const command = new ScanCommand({ 
    TableName: tableName as string,
  });

  console.log("what2");
  const response = await docClient.send(command);
  console.log("what");

  return Response.json(response);
}
