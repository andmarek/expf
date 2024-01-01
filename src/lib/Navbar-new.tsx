import Link from "next/link";
import React from "react";

interface NavLinkProps {
  linkText: string;
  destination: string;
}

function NavLink(props: NavLinkProps): React.JSX.Element {
  return <Link className="font-sans hover:drop-shadow-glow transition-all duration-500" href={props.destination}>
    {props.linkText}
  </Link>
}

export default function MyNavBar(): React.JSX.Element {
  const links = [
    ["home", "/"],
    ["about", "/about"],
    ["résumé", "/resume"],
    ["projects", "/projects"],
  ];

  return (
    <nav className="p-4 w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div>
          <Link className="bg-blue font-sans text-2xl text-purple" href="/">
            andmarek
          </Link>
        </div>
        <div className="space-x-4">
          {links.map(([linkText, destination], index) => (
            <NavLink
              key={index}
              linkText={linkText}
              destination={destination}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
