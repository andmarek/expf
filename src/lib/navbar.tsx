import React from "react";
//import Link from 'next/link';
import { Link } from "@radix-ui/themes";

const NavBar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center">
      <div className="text-2xl font-semibold">
        <Link href="/" className="transition-all duration-300  px-4">
          Retro Rover
        </Link>
      </div>
      <div>
        <Link href="/" className="transition-all duration-300 text-lg px-4 hover:text-red">
          Home
        </Link>
        <Link href="/profile" className="transition-all duration-300 text-lg px-4 hover:text-red">
          About
        </Link>
        <Link href="/controlPanel" className="transition-all duration-300 text-lg px-4 hover:text-red">
          My Boards
        </Link>
      </div>
    </nav >
  );
};

export default NavBar;
