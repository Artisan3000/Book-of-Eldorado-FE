import type { Role, User } from "@prisma/client";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export function toAppUser(user: User): AppUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
