import { Users, CalendarDays, BookMarked, Rocket } from "lucide-react";

export default function MemberPage() {
  const stats = [
    { icon: <Users className="w-5 h-5" />, label: "Community Members", value: 512 },
    { icon: <CalendarDays className="w-5 h-5" />, label: "Upcoming Events", value: 3 },
    { icon: <BookMarked className="w-5 h-5" />, label: "Resources Available", value: 18 },
    { icon: <Rocket className="w-5 h-5" />, label: "Growth Streak", value: "7 Days" },
  ];

  return (
    <section className="animate-fadeIn px-16 py-2">
      <h2 className="text-2xl italic mb-6 flex items-center gap-2">Welcome Back</h2>

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
        [Community Updates Placeholder]
      </div>
    </section>
  );
}
