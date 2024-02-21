import { NextRequest } from "next/server";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { TriangulationEventType } from "aws-sdk/clients/internetmonitor";

const tableName = process.env.BOARDS_DYNAMODB_TABLE;

function getCommentIdFromPath(pathName: string) {
  const pathParts = pathName.split("/");
  return pathParts.pop();
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  const boardId = data.boardId;
  const columnId = data.columnId;

  const commentId = getCommentIdFromPath(request.nextUrl.pathname);

  const updateExpression = "SET BoardColumns.#column_id.comments.#comment_id.likes = :";
  const expressionAttributeNames = {
    "#column_id": columnId,
    "#comment_id": commentId
  }

  const updateCommentCommand = new UpdateCommand({
    TableName: tableName as string,
    Key: {
      BoardId: boardId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,

  });
  return Response.json({ message: "Hello from the API" });
}
