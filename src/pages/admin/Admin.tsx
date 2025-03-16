import { ReactElement } from "react";
import AdminLogin from "./components/login/AdminLogin";

export default function Admin(): ReactElement {
  // TODO: if not logged in, proceed to admin login
  return <AdminLogin/>
}
