"use client";

import { useUser } from "@/app/providers/UserProvider";
import AdminDashboard from "./AdminDashboard";
import InstructorDashboard from "./InstructorDashboard";
import StudentDashboard from "./StudentDashboard";
import LoadingSkeleton from "./LoadingSkeleton";
import BlueprintDashboard from "./BlueprintDashboard";

export default function DashboardPage() {
  const { user, loading } = useUser();

  if (loading) return <LoadingSkeleton />;
  if (!user)
    return (
      <p className="text-center text-gray-600 mt-20">Please log in.</p>
    );

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "instructor":
      return <InstructorDashboard />;
    case "student":
      return <StudentDashboard />;
    case "blueprint_member":
      return <BlueprintDashboard />;
    default:
      return (
        <p className="text-center mt-20 text-gray-600">
          No dashboard available for your account.
        </p>
      );
  }
}
