import * as uuid from "uuid";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const ddb = new DynamoDBClient({});

// COMMENTS
export async function PUT(request: Request) {
  const formData = await request.formData();

  const boardName: string = formData.get("boardName") as string;
  const boardDescription: string = formData.get("boardDescription") as string;

  console.log(boardName);

  const Item = {
    Name: { S: boardName }, // todo change to boardName
    BoardDescription: { S: boardDescription },
    Date: { S: new Date().toISOString() },
    FeedbackItems: { L: [] },
    ActionItems: { L: [] },
  };
  console.log("wtf");
  const awsRes = await ddb.send(
    new PutItemCommand({
      TableName: "expf-boards",
      Item,
    })
  );
  console.log(awsRes);
  return Response.json(awsRes);
}


