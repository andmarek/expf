import * as uuid from "uuid";
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  GetCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

const tableName = "expf-boards";

interface ColumnInput {
  columnName: string;
  currentText: string;
  comments: {};
};
interface PutBoard {
  boardName: string;
  boardDescription: string;
  columnsInput: { [columnId: string]: ColumnInput };
};

export async function PUT(request: Request) {
  const formData = await request.json();
  console.log("----");
  console.log(formData);
  console.log("----");

  /* Normalize the input data */
  const columnsInputDict: { [columnId: string]: ColumnInput } = {};
  Object.entries(formData.columnsInput).forEach(([columnId, columnData]) => {
    columnsInputDict[columnId] = {
      columnName: columnData.name,
      currentText: "",
      comments: {} 
    };
  });
  const dynamoInput: PutBoard = {
    boardName: formData.boardName as string,
    boardDescription: formData.boardDescription as string,
    columnsInput: columnsInputDict
  };

  const command = new PutCommand({
    TableName: tableName as string,
    Item: {
      Name: dynamoInput.boardName, // todo change to boardName
      BoardDescription: dynamoInput.boardDescription,
      BoardColumns: dynamoInput.columnsInput,
      Date: new Date().toISOString(),
      FeedbackItems: [],
      ActionItems: [],
    },
  });
  const response = await docClient.send(command);
  console.log(response);
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
