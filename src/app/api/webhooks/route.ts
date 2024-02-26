import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { NextRequest } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const USERS_DYNAMODB_TABLE = process.env.USERS_DYNAMODB_TABLE

async function postUserToTable(userId: string) {
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    const command = new PutCommand({
        TableName: USERS_DYNAMODB_TABLE as string,
        Item: {
            UserId: userId,
            Boards: []
        }        
    });
    const response = await docClient.send(command);
    return Response.json(response);
}

async function createUserIfNotExists(userId: string) {
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    const params = {
      TableName: USERS_DYNAMODB_TABLE,
      Item: {
        UserId: userId,
      },
      ConditionExpression: "attribute_not_exists(userId)",
    };
  
    try {
      const result = await docClient.send(new PutCommand(params));
      console.log("User created successfully:", result);
      // Handle successful creation
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException") {
        console.log("User already exists with this userId.");
        // Handle the case where the user already exists
      } else {
        console.error("Error creating user:", error);
        // Handle other errors
      }
    }
  }

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
 
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }
 
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");
 
  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }
 
  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);
 
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);
 
  let evt: WebhookEvent
 
  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
 
  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType == "session.created") {
    const userId = evt.data.user_id;
    await createUserIfNotExists(userId)
    // check to see if they exist in the DB
    // if not, create with blank boards
    // could cross check whether or not any boards exist with the user
    // might be a new idea for a sort key
  }
  if (eventType == "user.created") {
    //await createUserIfNotExists(userId)
    console.log(body)
    // create new user here
    // await postUserToTable(userId);
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)
 
  return new Response('', { status: 200 })
}
 