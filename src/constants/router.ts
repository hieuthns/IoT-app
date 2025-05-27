import { IRouter } from "@/interfaces/router";

export type Routers = typeof ROUTERS;

export const ROUTERS = {
  login: {
    private: false,
    role: undefined,
    router: "/login",
    pattern: "/login"
  },
  dashboard: {
    private: true,
    role: undefined,
    router: "/dashboard",
    pattern: "/dashboard"
  },
  device: {
    private: true,
    role: undefined,
    router: "/device",
    pattern: "/device"
  },
  user: {
    private: true,
    role: ["ADMIN"],
    router: "/user",
    pattern: "/user"
  },
  home: {
    private: true,
    role: undefined,
    router: "/",
    pattern: "/",
  }
} satisfies Record<string, IRouter>;