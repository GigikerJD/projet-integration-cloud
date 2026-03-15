import { defineStore } from "pinia";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const useAuthStore = defineStore("authStore", {
  state: () => {
    const loggedIn: string | undefined = cookies.get("loggedIn") || "false";
    const token: string | undefined = cookies.get("token") || "";
    return {
      loggedIn: loggedIn,
      token: token,
    };
  },
  getters: {
    getLoggedIn: (state): boolean => state.loggedIn === "true",
    getToken: (state): string | undefined => state.token,
  },
  actions: {
    login(token: string): void {
      cookies.set("token", token, {
        path: "/",
        domain: "localhost",
        secure: false,
        httpOnly: false,
      });
      cookies.set("loggedIn", true, {
        path: "/",
        domain: "localhost",
        secure: false,
        httpOnly: false,
      });
      this.token = token;
      this.loggedIn = "true";
    },
    logout(): void {
      cookies.remove("token", { path: "/", domain: "localhost" });
      cookies.remove("loggedIn", { path: "/", domain: "localhost" });
      this.token = "";
      this.loggedIn = "false";
    },
  },
});
