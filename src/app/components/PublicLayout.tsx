import React from "react";

import { Outlet } from "react-router";
import { Navbar } from "./Navbar";

export function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
