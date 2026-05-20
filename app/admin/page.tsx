import type { JSX } from "react";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { mockAgents } from "@/src/lib/mockData";

export default function AdminPage(): JSX.Element {
  return <AdminDashboard agents={mockAgents} />;
}
