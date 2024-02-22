import { NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const tableName = process.env.BOARDS_DYNAMODB_TABLE;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

function getCommentIdFromPath(pathName: string) {
  const pathParts = pathName.split("/");
  return pathParts.pop();
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  const boardId = data.boardId;
  const columnId = data.columnId;

  const commentId = getCommentIdFromPath(request.nextUrl.pathname);

  const updateExpression = "SET BoardColumns.#column_id.comments.#comment_id.likes = BoardColumns.#column_id.comments.#comment_id.likes + :val";

  const expressionAttributeNames = {
    "#column_id": columnId,
    "#comment_id": commentId
  }
  const expressionAttributeValues = {
    ":val": 1
  }

  const updateCommentCommand = new UpdateCommand({
    TableName: tableName as string,
    Key: {
      BoardId: boardId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  });
  const dynamoResponse = await docClient.send(updateCommentCommand);
  return Response.json(dynamoResponse);
}


export async function DELETE(request: NextRequest) {
  const data = await request.json();

  const boardId = data.boardId;
  const columnId = data.columnId;

  const commentId = getCommentIdFromPath(request.nextUrl.pathname);

  console.log(boardId, columnId, commentId);

  const updateExpression = "SET BoardColumns.#column_id.comments.#comment_id.likes = BoardColumns.#column_id.comments.#comment_id.likes - :val";

  const expressionAttributeNames = {
    "#column_id": columnId,
    "#comment_id": commentId
  }
  const expressionAttributeValues = {
    ":val": 1
  }

  const updateCommentCommand = new UpdateCommand({
    TableName: tableName as string,
    Key: {
      BoardId: boardId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues
  });
  const dynamoResponse = await docClient.send(updateCommentCommand);
  return Response.json(dynamoResponse);
}
