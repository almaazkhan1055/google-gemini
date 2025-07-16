"use client";
import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CiChat1 } from "react-icons/ci";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import ChatroomList from "./ChatroomList";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { addChatroom } from "@/redux/slices/chatRoomSlice";
import toast from "react-hot-toast";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isSearching, setIsSearching] = useState(false);

  const handleAdd = () => {
    const title = prompt("Enter chatroom title:");
    if (title?.trim()) {
      const newRoom = {
        id: Date.now().toString(),
        title: title.trim(),
      };
      dispatch(addChatroom(newRoom));
      toast.success("Chatroom created!");
      router.push(`/chatroom/${newRoom.id}`);
    }
  };

  return (
    <div
      className={`bg-[#282A2C] text-white transition-all duration-300 ease-in-out flex flex-col items-start gap-6
      ${
        sidebarOpen
          ? "md:w-[300px] w-full"
          : "md:w-[100px] max-md:left-[1000px]"
      }
      h-screen fixed md:relative z-10
      p-3 md:p-5
      `}
    >
      <div className="flex items-center justify-between w-full">
        <div
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="w-[34px] h-[34px] hover:bg-[#a2a9b0] flex items-center justify-center rounded-full"
        >
          <GiHamburgerMenu size={18} className="cursor-pointer" />
        </div>
        {sidebarOpen && (
          <div
            onClick={() => setIsSearching((prev) => !prev)}
            className="w-[34px] h-[34px] hover:bg-[#a2a9b0] flex items-center justify-center rounded-full"
          >
            <FaSearch size={16} className="cursor-pointer" />
          </div>
        )}
      </div>

      {pathname !== "/dashboard" && !user ? (
        <Link
          href={"/dashboard"}
          className={`flex items-center text-lg gap-2 cursor-pointer font-semibold
          ${sidebarOpen ? "pl-2 pr-4 py-2 hover:bg-[#a2a9b0] rounded-full" : ""}
        `}
        >
          <CiChat1 size={24} />
          {sidebarOpen && <span className="text-sm ">New chat</span>}
        </Link>
      ) : (
        <button
          onClick={handleAdd}
          className={`flex items-center text-lg gap-2 cursor-pointer font-semibold
          ${sidebarOpen ? "pl-2 pr-4 py-2 hover:bg-[#a2a9b0] rounded-full" : ""}
        `}
        >
          <CiChat1 size={24} />
          {sidebarOpen && <span className="text-sm ">New chat</span>}
        </button>
      )}

      {/* Chatroom list */}
      {user && (
        <ChatroomList sidebarOpen={sidebarOpen} isSearching={isSearching} />
      )}
    </div>
  );
};

export default Sidebar;
