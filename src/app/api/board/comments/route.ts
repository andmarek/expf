import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function POST(request: Request) {
  const requestData = await request.json();

  const boardName: string = requestData.boardName;
  const columnName: string = requestData.columnName;
  const comments: string = requestData.comments;

  const command = new UpdateCommand({
    TableName: "expf-boards",
    Key: {
      Name: boardName,
    },
    UpdateExpression: "SET BoardColumns.#column.#comments = list_append(#column.#comments, :comments)",
    ExpressionAttributeNames: {
      "#column": columnName,
      "#comments": comments,
    },
  });
  const response = await docClient.send(command);
  console.log(response);
  return Response.json(response);

}
