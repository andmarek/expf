import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";
import { KMSClient, DecryptCommand } from "@aws-sdk/client-kms";

const client = new KMSClient({ region: "us-east-1" });
const kmsKeyId = process.env.AWS_BOARD_PASSWORDS_KEY_ID;

import { getBoard } from "@/src/app/lib/dynamo";

const tableName = process.env.BOARDS_DYNAMODB_TABLE;

async function verifyPassword(userEnteredPassword: string, decryptedPassword: string) {
  console.log("what", userEnteredPassword, decryptedPassword);
  try {
    const match = userEnteredPassword == decryptedPassword;
    if (match) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

async function decryptData(ciphertextBlob: string, keyId: string) {
  const command = new DecryptCommand({
    KeyId: keyId,
    CiphertextBlob: Buffer.from(ciphertextBlob, 'base64'),
  });
  const response = await client.send(command);
  const decryptedData = new TextDecoder().decode(response.Plaintext);
  return decryptedData;
}

export async function POST(req, res) {
  try {
    const reqJson = await req.json();

    const boardId: string = reqJson.boardId as string;
    const enteredPassword: string = reqJson.enteredPassword as string;

    const dynamoBoardResponse = await getBoard(tableName, boardId);

    const decryptedPassword = await decryptData(dynamoBoardResponse.Item.Password, kmsKeyId);

    const accessGranted = await verifyPassword(enteredPassword, decryptedPassword);

    if (accessGranted) {
      return NextResponse.json({ message: "Access granted" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({error: "Internal servor error"}, { status: 500 });
  }
}
