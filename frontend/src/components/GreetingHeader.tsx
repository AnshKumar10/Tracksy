import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const GreetingHeader = () => {
  const userContext = useContext(UserContext);

  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h1 className="text-2xl text-primary font-bold">
          {getGreeting()}, {userContext?.user?.name?.split(" ")[0] || "there"}!
          👋
        </h1>
        <p className="text-sm text-gray-500">
          Here's what's happening with your tasks today.
        </p>
      </div>
      <div className="text-sm text-gray-500">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
};
