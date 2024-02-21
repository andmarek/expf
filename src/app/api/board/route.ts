import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

const tableName = process.env.BOARDS_DYNAMODB_TABLE;

interface ColumnInput {
  columnName: string;
  comments: {};
}

interface PutBoard {
  boardId: string;
  boardName: string;
  boardDescription: string;
  columnsInput: { [columnId: string]: ColumnInput };
  boardPassword: string;
}

/* Create a new board */
export async function PUT(request: Request) {
  const req = await request.json();

  const columnsInputDict: { [columnId: string]: ColumnInput } = {};
  Object.entries(req.formData.columnsInput).forEach(
    ([columnId, columnData]) => {
      columnsInputDict[columnId] = {
        columnName: columnData.name,
        comments: {},
      };
    }
  );
  const dynamoInput: PutBoard = {
    boardId: req.boardId as string,
    boardName: req.formData.boardName as string,
    boardDescription: req.formData.boardDescription as string,
    columnsInput: columnsInputDict,
    boardPassword: req.formData.boardPassword,
  };

  const command = new PutCommand({
    TableName: tableName as string,
    Item: {
      BoardId: dynamoInput.boardId,
      BoardName: dynamoInput.boardName,
      BoardDescription: dynamoInput.boardDescription,
      BoardColumns: dynamoInput.columnsInput,
      Date: new Date().toISOString(),
      Password: dynamoInput.boardPassword,
    },
  });
  const response = await docClient.send(command);
  return Response.json(response);
}

/* Get a board by board Id */
export async function POST(request: Request) {
  const req = await request.json();

  const boardId: string = req.boardId as string;

  const command = new GetCommand({
    TableName: tableName,
    Key: {
      BoardId: boardId,
    },
  });
  const response = await docClient.send(command);

  return Response.json(response);
}

/* Delete a board by boardId */
export async function DELETE(request: Request) {
  const requestData = await request.json();

  const boardName: string = requestData.boardName as string;

  const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      Name: boardName,
    },
  });
  const response = await docClient.send(command);

  return Response.json(response);
}
