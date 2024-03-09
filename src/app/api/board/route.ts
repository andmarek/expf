import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcrypt";

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

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
  const createPassword: boolean = req.createPassword as boolean;

  const columnsInputDict: { [columnId: string]: ColumnInput } = {};

  let hashedPassword = "";

  console.log("create password", createPassword);

  if (createPassword == true) {
    const plainPassword = generatePlainPassword(10, true, false);
    const saltRounds = 10; // Recommended salt rounds for bcrypt
    hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
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
    boardPassword: hashedPassword,
    requirePassword: createPassword,
  };

  const command = new PutCommand({
    TableName: tableName as string,
    Item: {
      BoardId: dynamoInput.boardId,
      UserId: dynamoInput.userId,
      BoardName: dynamoInput.boardName,
      BoardDescription: dynamoInput.boardDescription,
      BoardColumns: dynamoInput.columnsInput,
      Date: new Date().toISOString(),
      Password: dynamoInput.boardPassword
    },
  });
  const response = await docClient.send(command);
  return Response.json(response);
}

/* Get a board by board Id  and user ID*/
export async function POST(request: Request) {
  const req = await request.json();

  const boardId: string = req.boardId as string;
  const userId: string = req.userId as string;
  console.log(userId);

  const command = new GetCommand({
    TableName: tableName,
    Key: {
      BoardId: boardId,
      UserId: userId,
    },
  });
  const response = await docClient.send(command);

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
