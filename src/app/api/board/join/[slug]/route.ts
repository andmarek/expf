import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { NextResponse } from "next/server";
import {
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

import { KMSClient, EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms";

const client = new KMSClient({ region: "us-east-1" });
const kmsKeyId = process.env.AWS_BOARD_PASSWORDS_KEY_ID;

import bcrypt from "bcrypt";
const ddb = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddb);

import { getBoard } from "@/src/app/lib/dynamo";

const tableName = process.env.BOARDS_DYNAMODB_TABLE;

async function verifyPassword(userEnteredPassword: string, decryptedPassword: string) {
  console.log("what", userEnteredPassword, decryptedPassword);
  try {
    const match = userEnteredPassword == decryptedPassword;
    if (match) {
      console.log('Passwords match! Granting access...');
      return true;
    } else {
      console.log('Passwords do not match.');
      return false;
    }
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
}

async function decryptData(ciphertextBlob: string, keyId: string) {
  const command = new DecryptCommand({
    KeyId: keyId,
    CiphertextBlob: Buffer.from(ciphertextBlob, 'base64'),
  });
  const response = await client.send(command);
  console.log(response);

  //const decryptedData = response.Plaintext.toString();

  const decryptedData = new TextDecoder().decode(response.Plaintext);

  console.log(decryptedData);

  return decryptedData;
}

export async function POST(req, res) {
  const reqJson = await req.json();

  console.log("this is getting the stuff");

  const boardId: string = reqJson.boardId as string;
  const enteredPassword: string = reqJson.enteredPassword as string;

  const dynamoBoardResponse = await getBoard(tableName, boardId);

  const encryptedPassword = dynamoBoardResponse.Item.Password;
  const decryptedPassword = await decryptData(encryptedPassword, kmsKeyId);
  console.log(decryptedPassword);
  const accessGranted = await verifyPassword(enteredPassword, decryptedPassword);

  console.log(accessGranted);

  if (accessGranted) {
    return NextResponse.json({ message: "Access granted" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "Access Denied" }, { status: 403 });
  }
}
