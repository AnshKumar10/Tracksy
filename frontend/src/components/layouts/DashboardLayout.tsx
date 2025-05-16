import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserContext } from "@/context/UserContext";
import { ADMIN_ROUTES, USER_ROUTES } from "@/lib/apiPaths";
import { UserRoles } from "@/lib/enums";
import { useContext, useState } from "react";
import { LogOut, LayoutDashboard, ChevronRight, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const DashboardLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const userContext = useContext(UserContext);
  const [darkMode, setDarkMode] = useState(false);

  const items =
    userContext?.user?.role === UserRoles.ADMIN ? ADMIN_ROUTES : USER_ROUTES;

  const getUserInitials = () => {
    if (!userContext?.user?.name) return "U";
    return userContext.user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      <SidebarProvider>
        <Sidebar className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col w-64">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xl font-bold">
              <LayoutDashboard className="w-6 h-6" />
              <span>TRACKSY</span>
            </div>

            {/* Dark Mode Button */}
            <Button
              variant="ghost"
              className="p-2 rounded-md text-gray-500 dark:text-gray-400"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>

          <SidebarContent className="flex flex-col justify-between h-full py-2">
            {/* Sidebar Menu */}
            <div>
              <SidebarGroup>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.id} className="mb-2">
                      <SidebarMenuButton asChild>
                        <a
                          href={item.path}
                          className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-all ease-in-out duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-md text-indigo-600 dark:text-indigo-400">
                              <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </div>

            <Separator className="my-2 bg-gray-200 dark:bg-gray-800" />
          </SidebarContent>

          {/* Profile and Logout Button at the Bottom */}
          <div className="flex flex-col justify-end px-3 py-4 mt-auto">
            {/* Profile */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userContext?.user?.profilePic} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {userContext?.user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                  {userContext?.user?.role}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900 transition-all"
              onClick={() => {
                // Handle logout action here
              }}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </Button>
          </div>
        </Sidebar>

        <main
          className={`flex-1 bg-gray-50 dark:bg-gray-950 overflow-auto transition-all duration-300`}
        >
          <div className="sticky top-0 z-10 text-primary bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center h-16">
            <SidebarTrigger />
          </div>
          <div className="p-6">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
};
