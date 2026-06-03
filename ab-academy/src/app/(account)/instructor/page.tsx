import { BookOpen, DollarSign, Users, Star } from "lucide-react";

export default function InstructorPage() {
  const stats = [
    { icon: <Users className="w-5 h-5" />, label: "Total Students", value: 248 },
    { icon: <BookOpen className="w-5 h-5" />, label: "Active Courses", value: 5 },
    { icon: <Star className="w-5 h-5" />, label: "Average Rating", value: "4.8 ★" },
    { icon: <DollarSign className="w-5 h-5" />, label: "Monthly Sales", value: "$3,240" },
  ];

  return (
    <section className="animate-fadeIn px-16 py-2">
      <h2 className="text-2xl italic mb-6 flex items-center gap-2">Overview</h2>

      <div className="grid md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-black p-6 flex flex-col items-center justify-center text-center transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="mb-3">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="border border-dashed border-gray-400 p-10 text-center text-gray-500 italic">
        [Course Performance Chart Placeholder]
      </div>
    </section>
  );
}
