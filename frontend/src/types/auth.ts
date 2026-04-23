import type { Role } from "./common";

export type User = {
  id: string;
  email: string;
  username: string;
  role: Role;
  must_change_password: boolean;
};

export type LoginResponse = {
  access: string;
  refresh: string;
  user: User;
};
