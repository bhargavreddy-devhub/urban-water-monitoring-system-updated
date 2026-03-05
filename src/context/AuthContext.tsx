import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("uwh_user");
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, password: string) => {
    const users: Array<{ id: string; name: string; email: string; password: string }> =
      JSON.parse(localStorage.getItem("uwh_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      throw new Error("Invalid credentials");
    }
    const { password: _pass, ...u } = found;
    setUser(u);
    localStorage.setItem("uwh_user", JSON.stringify(u));
  };

  const register = async (name: string, email: string, password: string) => {
    const users: Array<{ id: string; name: string; email: string; password: string }> =
      JSON.parse(localStorage.getItem("uwh_users") || "[]");
    if (users.find((u) => u.email === email)) {
      throw new Error("Email already in use");
    }
    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    localStorage.setItem("uwh_users", JSON.stringify(users));
    const { password: _pass, ...u } = newUser;
    setUser(u);
    localStorage.setItem("uwh_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("uwh_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
