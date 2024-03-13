import { NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { tableName } from "@/src/app/lib/dynamo"


const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const data = await request.json();

  const commentId = params.slug;

  const boardId = data.boardId;
  const userId = data.userId;
  const columnId = data.columnId;
  const editedCommentText = data.editedCommentText;


  const updateExpression =
    "SET BoardColumns.#column_id.comments.#comment_id.comment_text = :val";

  const expressionAttributeNames = {
    "#column_id": columnId,
    "#comment_id": commentId,
  };
  const expressionAttributeValues = {
    ":val": editedCommentText,
  };
  const updateCommentCommand = new UpdateCommand({
    TableName: tableName as string,
    Key: {
      BoardId: boardId,
      UserId: userId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  const dynamoResponse = await docClient.send(updateCommentCommand);
  return Response.json(dynamoResponse);
}
