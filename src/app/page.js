import { create } from "domain";
import Image from "next/image";

export default function Home() {
  const createButtonText = "Get Started"

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col text-center">
        <h1 className="text-6xl font-bold text-center">Easy Retro</h1>
        <h2> Click "{createButtonText}" to get started </h2>
        <form action="/create">
          <button class="bg-transparent hover:bg-blue text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            {createButtonText}
          </button>
        </form>
      </div>
    </main>
  );
}
