import { NextRequest, NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb"

import { tableName, getBoard } from "@/src/app/lib/dynamo";

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

/* Get the boards metadata by ID */
export async function POST(request: NextRequest, { params: { slug } }) {
  const boardId: string = slug;

  console.log("board id thing ", boardId);
  const response = await getBoard(tableName, boardId);
  console.log(response);
  const boardMetadata = {
    boardId: response.Item.BoardId,
    boardName: response.Item.BoardName,
  };
  console.log(boardMetadata)
  return Response.json(boardMetadata);
}
