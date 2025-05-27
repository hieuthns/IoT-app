"use client";

import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useMemo } from "react";
import { getPatternByRouter, getRegexByPattern, getRouter } from "@/utils/router";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface INavbarItem {
  url: string;
  label: string;
  icon: string;
  pattern: Array<RegExp>;
}

export const Header: React.FC = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const items = useMemo<Array<INavbarItem>>(
    () => [
      {
        url: "/dashboard",
        label: "Dữ liệu",
        icon: "solar:chart-bold-duotone",
        pattern: [getRegexByPattern(getPatternByRouter("dashboard"))]
      },
      {
        url: getRouter("user"),
        label: "Người dùng",
        icon: "solar:user-bold-duotone",
        pattern: [getRegexByPattern(getPatternByRouter("user"))]
      },
      {
        url: getRouter("device"),
        label: "Thiết bị",
        icon: "duo-icons:computer-camera",
        pattern: [getRegexByPattern(getPatternByRouter("device"))]
      },
    ], []
  );

  return (
    <Navbar isBordered className="bg-white  ">
      <NavbarContent justify="start">
        <NavbarBrand>
          <Icon icon="eos-icons:iot" fontSize={32} className="text-primary" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent>
        {items
        .filter((item) => (session?.role === "ADMIN" ? true : item.url !== getRouter("user")))
        .map((item, index) => (
          <NavbarItem key={index}>
            <Link 
              href={item.url} 
              className={
                clsx(
                  "flex items-center gap-2 hover:bg-blue-100 hover:text-blue-400 p-2 rounded-md font-bold",
                  item.pattern.some(pattern => pattern.test(pathname)) ? "bg-blue-100 text-blue-400" : "text-gray-600"
                )
              }
            >
              <Icon icon={item.icon} fontSize={20} />
              <span>{item.label}</span>
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <UserButton email={session?.user.email} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
};

const UserButton: React.FC<{ email?: string }> = ({ email }) => {
  return (
    <Button variant="faded" color="primary" onPress={() => signOut()}>
      <span className="text-xs">{email}</span>
      <Icon icon="uim:signout" fontSize={20} className="ml-2" />
    </Button>
  )
}