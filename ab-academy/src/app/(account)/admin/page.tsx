import { Users, BookOpen, DollarSign, ClipboardList } from "lucide-react";

export default function AdminPage() {
  const stats = [
    { icon: <Users className="w-5 h-5" />, label: "Total Users", value: "1,452" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Active Courses", value: "38" },
    { icon: <DollarSign className="w-5 h-5" />, label: "Monthly Revenue", value: "$12,540" },
    { icon: <ClipboardList className="w-5 h-5" />, label: "Pending Approvals", value: "6" },
  ];

  return (
    <section className="animate-fadeIn px-16 py-2">
      <h2 className="text-2xl italic mb-6 flex items-center gap-2">Overview</h2>

      <div className="grid md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-black p-6 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform"
          >
            <div className="mb-3">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="border border-dashed border-gray-400 p-10 text-center text-gray-500 italic">
        [User Activity Log Placeholder]
      </div>
    </section>
  );
}
