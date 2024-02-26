import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.BOARDS_DYNAMODB_TABLE;

export async function DELETE(request: Request) {
  const requestData = await request.json();

  const boardId: string = requestData.boardId;

  const userId: string = requestData.userId;

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
    TableName: tableName,
    Key: {
      BoardId: boardId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
  });

  const response = await docClient.send(command);
  return Response.json(response);
}

export async function POST(request: Request) {
  const requestData = await request.json();

  const boardId: string = requestData.boardId;
  const userId: string = requestData.userId;

  const commentText: string = requestData.commentText;

  const commentObj = {
    "text": commentText,
    "likes": 0
  }

  const commentId: string = requestData.commentId;
  const columnId: string = requestData.columnId;

  const updateExpression =
    "SET BoardColumns.#column_id.comments.#comment_id = :comment_obj";
  const expressionAttributeNames = {
    "#column_id": columnId,
    "#comment_id": commentId,
  };
  const expressionAttributeValues = {
    ":comment_obj": commentObj,
  };

  const command = new UpdateCommand({
    TableName: tableName,
    Key: {
      BoardId: boardId,
      UserId: userId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  const response = await docClient.send(command);

  return Response.json(response);
}
