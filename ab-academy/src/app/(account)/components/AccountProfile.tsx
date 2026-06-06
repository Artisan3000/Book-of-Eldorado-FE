import { Settings } from "lucide-react";
import type { AppUser } from "@/lib/user";
import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountProfile({ user }: { user: AppUser }) {
  return (
    <section className="px-16 py-8 animate-fadeIn">
      <h2 className="text-2xl mb-6 flex items-center gap-2">
        Account & Profile Settings <Settings className="w-5 h-5" />
      </h2>

      <div className="border border-black p-6 max-w-2xl">
        <p className="font-semibold mb-2">{user.name}</p>
        <p className="text-sm mb-1">Email: {user.email}</p>
        <p className="text-sm mb-1">Role: {user.role}</p>

        <div className="mt-4 flex gap-3">
          <button className="border border-black px-3 py-1 text-sm hover:bg-gray-100 transition">
            Edit Profile
          </button>
        </div>

        <ChangePasswordForm />
      </div>
    </section>
  );
}
