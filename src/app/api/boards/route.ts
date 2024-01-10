import * as uuid from "uuid";
import { DynamoDBClient, DescribeTableCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

const tableName = "expf-boards";

export async function GET() {
  const command = new ScanCommand({ 
    TableName: tableName as string,
  });

  const response = await docClient.send(command);

  return Response.json(response);
}
