import { NextResponse } from "next/server";
import { KMSClient, DecryptCommand } from "@aws-sdk/client-kms";
import { decryptData } from "@/src/app/lib/kms"

const client = new KMSClient({ region: "us-east-1" });
const kmsKeyId = process.env.AWS_BOARD_PASSWORDS_KEY_ID;

import { tableName, getBoard } from "@/src/app/lib/dynamo";

async function verifyPassword(userEnteredPassword: string, decryptedPassword: string) {
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

export async function POST(req, res) {
  try {
    const reqJson = await req.json();

    const boardId: string = reqJson.boardId as string;

    const dynamoBoardResponse = await getBoard(tableName, boardId);
    let accessGranted: boolean = false;
    if (dynamoBoardResponse.Item.passwordRequired == false) {
      accessGranted = true;
    } else {
      const enteredPassword = reqJson.enteredPassword as string;
      const decryptedpassword = await decryptData(dynamoBoardResponse.Item.Password, kmsKeyId);

      console.log("decrypted", decryptedpassword);
      console.log("entered", enteredPassword);
      accessGranted = await verifyPassword(enteredPassword, decryptedpassword);
    }

    if (accessGranted) {
      console.log("access granted");
      return NextResponse.json({ message: "Access granted" }, { status: 200 });
    } else {
      console.log("wtf bro");
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal servor error" }, { status: 500 });
  }
}
