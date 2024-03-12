import BoardEntryView from "./BoardEntryView"

export default function JoinBoardPage({ params }: { params: { slug: string } }) {
  
  return (
    <BoardEntryView
            boardName={boardName}
            setHasJoined={setHasJoined}
            setUserName={setUserName}
            passwordRequired={passwordRequired}
          />
  )
}
