import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { tableName, getBoard } from "@/src/app/lib/dynamo";
import { decryptData, encryptData } from "@/src/app/lib/kms";

const kmsKeyId = process.env.AWS_BOARD_PASSWORDS_KMS_KEY_ID;

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const boardId: string = params.slug;
  console.log(boardId);
  const response = await getBoard(tableName, boardId);

  const decryptedPassword = await decryptData(response.Item.Password, kmsKeyId);
  console.log(decryptedPassword);
  return Response.json({ password: decryptedPassword });
}

/* Set the password of the board after the fact */
export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const ddb = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(ddb)

  const boardId: string = params.slug;
  const requestData = await request.json()

  const passwordToPut: string = requestData.newBoardPassword;

  const encryptedPassword = await encryptData(passwordToPut, kmsKeyId)

  const command = new UpdateCommand({
    TableName: tableName,
    Key: {
      BoardId: boardId,
    },
    UpdateExpression: "set RequirePassword = :r, Password = :p",
    ExpressionAttributeValues: {
      ":r": true,
      ":p": encryptedPassword
    },
    ReturnValues: "UPDATED_NEW"
  });

  console.log(boardId);

  const response = await docClient.send(command);
  return Response.json(response);
}
