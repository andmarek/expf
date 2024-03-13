import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

import { tableName } from "@/src/app/lib/dynamo";

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

export async function GET() {
  const command = new ScanCommand({
    TableName: tableName as string,
  });

  const response = await docClient.send(command);

  return Response.json(response);
}
