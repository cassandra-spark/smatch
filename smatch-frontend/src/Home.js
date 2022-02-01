import React from "react"
import { Outlet, NavLink } from "react-router-dom";

import { ReactComponent as CogIcon } from "./icons/cog.svg";
import { ReactComponent as HomeIcon } from "./icons/home.svg";
import { ReactComponent as MessageIcon } from "./icons/message.svg";
import { ReactComponent as ViewListIcon } from "./icons/view-list.svg";
import { ReactComponent as ChartBarIcon } from "./icons/chart-bar.svg";

export default function Home() {
  return (
    <div className="bg-slate-800 flex flex-col items-center justify-between min-h-screen">
      <div className="w-full max-w-4xl min-h-screen flex flex-col pb-24">
        <Outlet />
        <div className="fixed bottom-0 inset-x-0 h-24 flex items-center justify-center">
          <div className="bg-gray-900 px-4 py-2 rounded-xl flex items-center gap-3">
            <NavigationItem icon={<CogIcon />} to="/settings" />
            <NavigationItem icon={<HomeIcon />} to="/" />
            <NavigationItem icon={<ViewListIcon />} to="/choose" />
            <NavigationItem icon={<MessageIcon />} to="/forum" badge="2" />
            <NavigationItem icon={<ChartBarIcon />} to="/visualization" />
          </div>
        </div>
      </div>
    </div>
  )
}

function NavigationItem({ icon, to, badge }) {
  return (
    <NavLink to={to} className={({ isActive }) => `fill-amber-500 ${isActive ? "w-12 h-12" : "w-8 h-8"} relative`}>
      {React.cloneElement(icon, { className: "w-full h-full" })}
      {badge ? (
        <span className="absolute -top-1 -right-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{badge}</span>
      ) : <></>}
    </NavLink>
  );
}
