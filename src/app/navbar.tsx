import React from "react";
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";


const NavBar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center border-b border-base-300">
      <div className="text-2xl m-2">
        <Link href="/" className="transition-all duration-300 text-lg mx-2 text-base-800 hover:text-base-900">
          Retro Rover
        </Link>
      </div>
      <div className="flex flex-row space-x-4 m-2">
        <UserButton />
        <Link href="/" className="text-base-600 hover:text-base-800 hover:no-underline transition-all duration-300 text-lg mr-2">
          Home
        </Link>
        <Link href="/about" className="text-base-600 hover:text-base-800 hover:no-underline transition-all duration-300 text-lg mx-2">
          About
        </Link>
        <Link href="/controlPanel" className="text-base-600 hover:text-base-800 hover:no-underline transition-all duration-300 text-lg mx-2">
          Boards
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
