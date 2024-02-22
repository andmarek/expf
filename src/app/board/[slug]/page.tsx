"use client";
import Board from "./Board";

export default function Page({ params }: { params: { slug: string } }) {
  const boardId: string = params.slug;

  return (
    <Board boardId={boardId} />
  )
}
