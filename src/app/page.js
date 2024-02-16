import { Button, Heading } from "@radix-ui/themes";
export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col text-center">
          <Heading className="my-2" align="center" weight="bold" size="9"> Retro Rover</Heading>
          <Heading className="my-2" align="center" weight="light"> Sprint Retrospectives Made Easy, Effective, and Enjoyable </Heading>
          <form className="my-2" action="/create">
            <Button size="3"> Get Started </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
