import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb"

export const tableName = process.env.BOARDS_DYNAMODB_TABLE

export async function getBoard(tableName: string, boardId: string) {
  const ddb = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(ddb)

  const command = new GetCommand({
    TableName: tableName,
    Key: {
      BoardId: boardId,
    },
  });
  const response = await docClient.send(command);
  return response;
}
