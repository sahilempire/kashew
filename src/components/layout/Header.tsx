import React from "react";
import { Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  title?: string;
  className?: string;
}

const Header = ({ title = "Dashboard", className = "" }: HeaderProps) => {
  const { user, signOut } = useAuth();

  return (
    <div
      className={`h-16 border-b border-gray-100 flex items-center justify-between px-6 ${className}`}
    >
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[200px] lg:w-[300px] pl-8 bg-background rounded-full"
          />
        </div>

        <ThemeSwitcher />

        <button className="p-2 rounded-full hover:bg-accent relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-vibrant-pink"></span>
        </button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="h-8 w-8 rounded-full bg-vibrant-yellow flex items-center justify-center cursor-pointer">
                <span className="text-sm font-medium text-black">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-red-500 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Header;
