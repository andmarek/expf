import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

import { KMSClient, EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms";

const client = new KMSClient({ region: "us-east-1" });
const kmsKeyId = process.env.AWS_BOARD_PASSWORDS_KMS_KEY_ID;

import { getBoard } from "@/src/app/lib/dynamo";

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);
import bcrypt from "bcrypt";

const tableName = process.env.BOARDS_DYNAMODB_TABLE;

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

async function encryptData(plaintext, keyId) {
  const command = new EncryptCommand({
    KeyId: keyId, // The ARN of your KMS key
    Plaintext: Buffer.from(plaintext),
  });
  const encryptedBlob = await client.send(command);
  const buff = Buffer.from(encryptedBlob.CiphertextBlob);
  const encryptedBase64Data = buff.toString("base64");
  return encryptedBase64Data;
}

function generatePlainPassword(length = 10, includeNumbers = true, includeSymbols = false) {
  const charset = [
    "abcdefghijkmnopqrstuvwxyz", // Avoiding 'l' for clarity
    "ABCDEFGHJKLMNPQRSTUVWXYZ", // Avoiding 'I' and 'O' for clarity
    "23456789", // Avoiding '0' and '1' for clarity
    "!@#$%^&*" // Example symbols, adjust as needed
  ];

  // Determine which character sets to include
  let charactersToUse = charset[0] + charset[1]; // Always include lowercase and uppercase
  if (includeNumbers) charactersToUse += charset[2];
  if (includeSymbols) charactersToUse += charset[3];

  // Generate the password
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersToUse.length);
    password += charactersToUse[randomIndex];
  }

  return password;
}

/* Create a new board */
export async function PUT(request: Request) {
  const req = await request.json();
  const columnFormData = req.formData.columnsInput as ColumnFormData[];
  const requirePassword: boolean = req.requirePassword as boolean;
  const columnsInputDict: { [columnId: string]: ColumnInput } = {};

  console.log("create password", requirePassword);

  let encryptedPassword = "";

  if (requirePassword == true) {
    const plainPassword = generatePlainPassword(10, true, false);
    encryptedPassword = await encryptData(plainPassword, kmsKeyId);
    /*
    const saltRounds = 10;
    hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    */
  }


  // Create a dictionary of columnId to columnData
  Object.entries(columnFormData).forEach(
    ([columnIndex, columnData]) => {
      columnsInputDict[columnIndex] = {
        columnName: columnData.columnName,
        comments: {},
      };
    }
  );

  console.log(req.userId);

  const dynamoInput: PutBoard = {
    boardId: req.boardId as string,
    userId: req.userId as string,
    boardName: req.formData.boardName as string,
    boardDescription: req.formData.boardDescription as string,
    columnsInput: columnsInputDict,
    boardPassword: encryptedPassword as string,
    requirePassword: req.requirePassword as boolean,
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
      RequirePassword: dynamoInput.requirePassword
    },
  });
  const response = await docClient.send(command);
  return Response.json(response);
}

/* Get a board by board Id  and user ID*/
export async function POST(request: Request) {
  const req = await request.json();

  const boardId: string = req.boardId as string;

  const response = await getBoard(tableName, boardId);

  return Response.json(response);
}

/* Delete a board by boardId */
export async function DELETE(request: Request) {
  const req = await request.json();

  const boardId: string = req.boardId as string;
  const userId: string = req.userId as string;

  console.log(boardId);

  const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      BoardId: boardId,
      UserId: userId,
    },
  });

  const response = await docClient.send(command);

  return Response.json(response);
}
