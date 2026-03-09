import { Outlet } from "react-router";
import { UserProvider } from "./UserContext";

export function RootLayout() {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  );
}