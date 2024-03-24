import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { tableName } from "@/src/app/lib/dynamo";

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

const kmsKeyId = process.env.AWS_BOARD_PASSWORDS_KEY_ID as string;

export async function GET() {
  const command = new ScanCommand({
    TableName: tableName as string,
  });

  const response = await docClient.send(command);
  const boards = response.Items;
  console.log(boards)

  const boardsMetadata = boards.map((board) => {
    return {
      BoardId: board.BoardId,
      BoardName: board.BoardName,
      BoardDescription: board.BoardDescription,
      DateCreated: board.Date,
      RequirePassword: board.RequirePassword,
    }
  });

  console.log(boardsMetadata);
  return Response.json(boardsMetadata);
}
