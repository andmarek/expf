import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function DELETE(request: Request) {
  const requestData = await request.json();

  const boardName: string = requestData.boardName;
  const commentId: string = requestData.commentId;
  const columnId: string = requestData.columnId;

  // Using REMOVE operation in UpdateExpression
  const updateExpression =
    "REMOVE BoardColumns.#column_id.comments.#comment_id";
  const expressionAttributeNames = {
    "#column_id": columnId,
    "#comment_id": commentId,
  };
  const command = new UpdateCommand({
    TableName: "expf-boards",
    Key: {
      Name: boardName,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
  });

  const response = await docClient.send(command);
  return Response.json(response);
}

export async function POST(request: Request) {
  const requestData = await request.json();

  const boardName: string = requestData.boardName;
  const commentText: string = requestData.commentText;
  const commentId: string = requestData.commentId;
  const columnId: string = requestData.columnId;

  const updateExpression =
    "SET BoardColumns.#column_id.comments.#comment_id = :comment_text";
  const expressionAttributeNames = {
    "#column_id": columnId,
    "#comment_id": commentId,
  };
  const expressionAttributeValues = {
    ":comment_text": commentText,
  };

  const command = new UpdateCommand({
    TableName: "expf-boards",
    Key: {
      Name: boardName,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  const response = await docClient.send(command);

  return Response.json(response);
}
