import { redirect } from "next/navigation";

export default function LegacyRequestsRedirect() {
  redirect("/admin/blood-requests");
}
