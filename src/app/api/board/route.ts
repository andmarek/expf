import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

import { KMSClient, EncryptCommand } from "@aws-sdk/client-kms";

import { tableName, getBoard } from "@/src/app/lib/dynamo";
import { generatePlainPassword } from "@/src/app/lib/utils";

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

const client = new KMSClient({ region: "us-east-1" });
const kmsKeyId = process.env.AWS_BOARD_PASSWORDS_KMS_KEY_ID;


interface ColumnInput {
  columnName: string;
  comments: {};
}

interface ColumnFormData {
  columnName: string;
}

interface PutBoard {
  boardId: string;
  boardName: string;
  boardDescription: string;
  columnsInput: { [columnId: string]: ColumnInput };
  boardPassword: string;
  userId: string;
  requirePassword: boolean;
}

async function encryptData(plaintext: string, keyId: string) {
  const command = new EncryptCommand({
    KeyId: keyId,
    Plaintext: Buffer.from(plaintext),
  });
  const encryptedBlob = await client.send(command);
  const buff = Buffer.from(encryptedBlob.CiphertextBlob);
  const encryptedBase64Data = buff.toString("base64");
  return encryptedBase64Data;
}

/* Create a new board */
export async function PUT(request: Request) {
  const reqBodyJson = await request.json();

  const columnFormData = reqBodyJson.boardConfig
    .columnsInput as ColumnFormData[];
  const requirePassword: boolean = reqBodyJson.requirePassword as boolean;

  const columnsInputDict: { [columnId: string]: ColumnInput } = {};

  const encryptedPassword = requirePassword
    ? await encryptData(generatePlainPassword(10, true, false), kmsKeyId)
    : "";

  // TODO: is this necessary?
  // Create a dictionary of columnId to columnData
  Object.entries(columnFormData).forEach(([columnIndex, columnData]) => {
    columnsInputDict[columnIndex] = {
      columnName: columnData.columnName,
      comments: {},
    };
  });

  const dynamoInput: PutBoard = {
    boardId: reqBodyJson.boardId as string,
    userId: reqBodyJson.userId as string,
    boardName: reqBodyJson.formData.boardName as string,
    boardDescription: reqBodyJson.formData.boardDescription as string,
    columnsInput: columnsInputDict,
    boardPassword: encryptedPassword as string,
    requirePassword: reqBodyJson.requirePassword as boolean,
  };

  const command = new PutCommand({
    TableName: tableName as string,
    Item: {
      BoardId: dynamoInput.boardId,
      BoardName: dynamoInput.boardName,
      UserId: dynamoInput.userId,
      BoardColumns: dynamoInput.columnsInput,
      Date: new Date().toISOString(),
      BoardDescription: dynamoInput.boardDescription,
      Password: dynamoInput.boardPassword,
      RequirePassword: dynamoInput.requirePassword,
    },
  });
  const response = await docClient.send(command);
  return Response.json(response);
}

/* Get a board by board Id  and user ID*/
export async function POST(request: Request) {
  const reqBodyJson = await request.json();
  const boardId: string = reqBodyJson.boardId as string;
  const response = await getBoard(tableName, boardId);
  return Response.json(response);
}

/* Delete a board by boardId */
export async function DELETE(request: Request) {
  const reqBodyJson = await request.json();
  const boardId: string = reqBodyJson.boardId as string;
  const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      BoardId: boardId,
    },
  });
  const response = await docClient.send(command);
  return Response.json(response);
}
