import { createContext, useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { API_PATHS } from "@/lib/apiPaths";
import type { UserInterface } from "@/lib/types/user";

interface UserContextType {
  user: UserInterface | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
  updateUser: (updatedUser: UserInterface) => void;
}

const UserContext = createContext<UserContextType | null>(null);

const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("access_token");
  };

  const updateUser = (updatedUser: UserInterface) => {
    setUser(updatedUser);
    localStorage.setItem("access_token", updatedUser.token);
    setLoading(false);
  };

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USER.GET_PROFILE);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      clearUser();
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, loading, fetchUser, clearUser, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
export default UserProvider;
