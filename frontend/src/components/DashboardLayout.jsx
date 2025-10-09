import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen theme-background theme-text-primary">
      <SideBar />
      <div className="flex-1 p-8 overflow-auto theme-background">
        <Outlet />
      </div>
    </div>
  );
}
