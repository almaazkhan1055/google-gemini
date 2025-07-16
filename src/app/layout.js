"use client";

import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { loadUserFromLocalStorage } from "@/redux/slices/authSlice";
import { loadMessagesFromStorage } from "@/redux/slices/messageSlice";
import { loadChatroomsFromStorage } from "@/redux/slices/chatRoomSlice";
import { loadThemeFromStorage } from "@/redux/slices/themeSlice";

function AppLayout({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const isAuthRoute = pathname.startsWith("/signin");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messages = useSelector((state) => state.messages);
  const chatrooms = useSelector((state) => state.chatroom.chatrooms);
  const theme = useSelector((state) => state.theme.mode);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
    dispatch(loadThemeFromStorage());

    const savedMessages = localStorage.getItem("messages");
    if (savedMessages) {
      dispatch(loadMessagesFromStorage(JSON.parse(savedMessages)));
    }

    const savedChatrooms = localStorage.getItem("chatrooms");
    if (savedChatrooms) {
      dispatch(loadChatroomsFromStorage(JSON.parse(savedChatrooms)));
    }

    setTimeout(() => setIsHydrated(true), 100);
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatrooms", JSON.stringify(chatrooms));
  }, [chatrooms]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  if (!isHydrated) return null;

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex max-h-screen bg-white text-black dark:bg-[#181818] dark:text-white transition-colors duration-300">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-col w-full items-center justify-between h-screen">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="w-full p-5 max-md:h-[88%] h-screen flex items-center justify-center">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <Toaster />
          <AppLayout>{children}</AppLayout>
        </Provider>
      </body>
    </html>
  );
}
