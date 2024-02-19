import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

const tableName = "expf-boards";

interface ColumnInput {
  columnName: string;
  comments: {};
}

interface PutBoard {
  boardName: string;
  boardDescription: string;
  columnsInput: { [columnId: string]: ColumnInput };
  boardPassword: string;
}

export async function PUT(request: Request) {
  const formData = await request.json();

  const columnsInputDict: { [columnId: string]: ColumnInput } = {};
  Object.entries(formData.columnsInput).forEach(([columnId, columnData]) => {
    console.log(columnData.name);

    columnsInputDict[columnId] = {
      columnName: columnData.name,
      comments: {},
    };
  });
  const dynamoInput: PutBoard = {
    boardName: formData.boardName as string,
    boardDescription: formData.boardDescription as string,
    columnsInput: columnsInputDict,
    boardPassword: formData.boardPassword,
  };

  const command = new PutCommand({
    TableName: tableName as string,
    Item: {
      Name: dynamoInput.boardName, // todo change to boardName
      BoardDescription: dynamoInput.boardDescription,
      BoardColumns: dynamoInput.columnsInput,
      Date: new Date().toISOString(),
      Password: dynamoInput.boardPassword,
    },
  });
  const response = await docClient.send(command);
  return Response.json(response);
}

export async function POST(request: Request) {
  const requestData = await request.json();

  const boardName: string = requestData.boardName as string;

  const command = new GetCommand({
    TableName: tableName,
    Key: {
      Name: boardName,
    },
  });
  const response = await docClient.send(command);

  return Response.json(response);
}

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
