import { tableName, getBoard } from "@/src/app/lib/dynamo";
import { decryptData } from "@/src/app/lib/kms";

const kmsKeyId = process.env.AWS_BOARD_PASSWORDS_KEY_ID as string;

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const boardId: string = params.slug;
  console.log(boardId);
  const response = await getBoard(tableName, boardId);

  const decryptedPassword = await decryptData(response.Item.Password, kmsKeyId);
  console.log(decryptedPassword);
  return Response.json({ password: decryptedPassword });
}
