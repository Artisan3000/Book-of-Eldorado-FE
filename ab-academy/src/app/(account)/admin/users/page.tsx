import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <section className="animate-fadeIn px-8 py-2 md:px-16">
      <div className="mb-6">
        <h2 className="text-2xl italic">Users</h2>
        <p className="mt-2 text-sm text-gray-600">
          {users.length} total account{users.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="overflow-x-auto border border-black">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-black">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">
                  {user.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-3">
                  {user.createdAt.toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
