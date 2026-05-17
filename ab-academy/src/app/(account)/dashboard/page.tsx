import { redirect } from "next/navigation";
import { getRoleHomeRoute } from "@/lib/auth";
import { requireUser } from "@/lib/current-user";

export default async function DashboardRedirect() {
  const user = await requireUser();

  redirect(getRoleHomeRoute(user.role));
}
