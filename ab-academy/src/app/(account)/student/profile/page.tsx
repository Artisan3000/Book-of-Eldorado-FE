import { Settings } from "lucide-react";

export default function StudentProfile() {
  const profile = {
    name: "Brian Felix",
    email: "brian@student.artisanbarber.com",
    plan: "Pro Student",
    renewal: "Nov 15, 2025",
  };

  return (
    <section className="px-16 py-8 animate-fadeIn">
      <h2 className="text-2xl mb-6 flex items-center gap-2">
        Account & Profile Settings <Settings className="w-5 h-5" />
      </h2>

      <div className="border border-black p-6 max-w-2xl">
        <p className="font-semibold mb-2">{profile.name}</p>
        <p className="text-sm mb-1">Email: {profile.email}</p>
        <p className="text-sm mb-1">Plan: {profile.plan}</p>
        <p className="text-sm text-gray-700 mb-4">
          Renewal Date: {profile.renewal}
        </p>

        <div className="flex gap-3">
          <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
            Edit Profile
          </button>
          <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
            Change Password
          </button>
        </div>
      </div>
    </section>
  );
}
