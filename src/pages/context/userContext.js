"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UserContext = createContext();

export function UserProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  // const [user, setUser] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     const storedUser = localStorage.getItem("user");
  //     return storedUser ? JSON.parse(storedUser) : null;
  //   }
  //   return null;
  // });
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user"); // Clear user on logout
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem("user"); // Clear user data
    router.push("/signup"); // Redirect to signup page
  };

  return (
    <UserContext.Provider value={{ logout, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
