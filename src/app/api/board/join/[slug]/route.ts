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

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const reqJson = await req.json();
    console.log("Join request received:", reqJson);

    const boardId: string = params.slug;

    const dynamoBoardResponse = await getBoard(tableName, boardId);
    console.log("Board data:", dynamoBoardResponse.Item);
    console.log("All field names:", Object.keys(dynamoBoardResponse.Item));
    console.log("passwordRequired field:", dynamoBoardResponse.Item.passwordRequired);
    console.log("RequirePassword field:", dynamoBoardResponse.Item.RequirePassword);
    console.log("Password field:", dynamoBoardResponse.Item.Password);
    
    let accessGranted: boolean = false;
    // Use the correct field name from the database
    const isPasswordRequired = dynamoBoardResponse.Item.RequirePassword === true;
    
    console.log("Is password required?", isPasswordRequired);
                              
    if (!isPasswordRequired) {
      console.log("No password required, granting access");
      accessGranted = true;
    } else {
      const enteredPassword = reqJson.enteredPassword as string;
      const encryptedPassword = dynamoBoardResponse.Item.Password;
      
      console.log("Encrypted password from DB:", encryptedPassword);
      console.log("Password required:", dynamoBoardResponse.Item.passwordRequired);
      
      if (!encryptedPassword) {
        console.error("No encrypted password found in database but password is required");
        return NextResponse.json({ error: "Board configuration error: missing password" }, { status: 500 });
      }
      
      const decryptedpassword = await decryptData(encryptedPassword, kmsKeyId);

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
    console.error("Error in join API:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
