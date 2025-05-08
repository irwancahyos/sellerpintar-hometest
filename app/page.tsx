// ******** Imports ********
import { redirect } from "next/navigation";

// ******** Component Declaration ********
export default function Home() {
  // Redirect all user to login page
  redirect("/login");
}