import { Button, Heading } from "@radix-ui/themes";
export default function Home() {
  const createButtonText = "Get Started";

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col text-center">
          <Heading align="center" weight="bold" size="9"> Retro Rover</Heading>
          <Heading align="center" weight="light"> Sprint Retrospectives Made Easy, Effective, and Enjoyable </Heading>
          <form action="/create">
            <Button> {createButtonText} </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
