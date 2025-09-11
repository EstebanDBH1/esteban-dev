import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center">
      <h1 className=" text-[20px]">Esteban Blanco</h1>
      <ul className=" flex items-center gap-1">
        <li><a href="#" className="text-[22px]">About, </a></li>
        <li><a href="#" className="text-[22px]">Work</a></li>
      </ul>
    </header>
  );
};

export default Header;
