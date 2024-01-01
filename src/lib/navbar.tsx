import React from "react";
import Link from 'next/link';

const NavBar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center">
      <div className="text-2xl font-semibold">
        <Link href="/" className="transition-all duration-300 hover:text-red px-4">
          expf
        </Link>
      </div>
      <div>
        <Link href="/" className="transition-all duration-300 text-lg px-4 hover:text-red">
          Home
        </Link>
        <Link href="/profile" className="transition-all duration-300 text-lg px-4 hover:text-red">
          About
        </Link>
        <Link href="/profile" className="transition-all duration-300 text-lg px-4 hover:text-red">
          Profile
        </Link>
      </div>
    </nav >
  );
};

export default NavBar;
