import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { HiBell } from "react-icons/hi";
import { LogOut } from "lucide-react";

function DeptLayout() {

  const navigate = useNavigate();
  const department = localStorage.getItem("department") || "Department";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1a33] to-[#020617] text-white">

      {/* ✅ TOP NAVBAR */}
      <header className="h-20 border-b border-slate-800 flex items-center justify-between px-10">

        {/* LOGO */}
        <h1 className="text-2xl font-bold tracking-wide">
          Civic<span className="text-indigo-400">Dept</span>
        </h1>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-8">

          <NavLink
            to="/dept/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-indigo-400 font-semibold"
                : "text-slate-300 hover:text-white transition"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/dept/issues"
            className={({ isActive }) =>
              isActive
                ? "text-indigo-400 font-semibold"
                : "text-slate-300 hover:text-white transition"
            }
          >
            Issues
          </NavLink>

        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">

          {/* Department Badge */}
          <div className="bg-indigo-600 px-4 py-1 rounded-full text-sm">
            {department}
          </div>

          {/* 🔔 Inbox */}
          <button
            onClick={() => navigate("/inbox")}
            className="relative hover:text-indigo-400 transition"
          >
            <HiBell size={24}/>
            <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full"/>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2
              bg-indigo-600 hover:bg-indigo-700
              px-5 py-2 rounded-xl
              transition
              shadow-lg
            "
          >
            <LogOut size={18}/>
            Logout
          </button>

        </div>

      </header>

      {/* PAGE CONTENT */}
      <main className="p-10">
        <Outlet />
      </main>

    </div>
  );
}

export default DeptLayout;
