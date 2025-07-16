"use client";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/redux/slices/authSlice";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const theme = useSelector((state) => state.theme.mode);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/signin");
  };

  return (
    <nav className="flex items-center justify-between w-full px-4 py-3 border-b border-gray-300 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <GiHamburgerMenu size={20} />
        </button>

        <h1 className="text-xl font-bold text-[#a2a9b0]">Gemini</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={user ? handleLogout : () => router.push("/signin")}
          className="bg-[#8ab4f8] text-gray-900 rounded-md px-4 py-1 text-sm md:text-base font-medium hover:opacity-90 transition"
        >
          {user ? "Log out" : "Sign in"}
          {console.log(user)}
        </button>

        <button
          onClick={() => dispatch(toggleTheme())}
          className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-md px-3 py-1 text-base hover:opacity-90 transition"
          title="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
