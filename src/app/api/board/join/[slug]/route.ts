import { NextResponse } from "next/server";
import { tableName, getBoard } from "@/src/app/lib/dynamo";

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const reqJson = await req.json();
    console.log("Join request received:", reqJson);

    const boardId: string = params.slug;

    // Verify the board exists
    const dynamoBoardResponse = await getBoard(tableName, boardId);
    
    if (!dynamoBoardResponse.Item) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    console.log("Board found, granting access");
    return NextResponse.json({ message: "Access granted" }, { status: 200 });
    
  } catch (error) {
    console.error("Error in join API:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
