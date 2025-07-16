"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/signin");
    }
  }, []);
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="dark:text-white text-red-500 md:text-3xl text-xl">
        Welcome, lets start the chat to make prompt visible!
      </h1>
    </div>
  );
};

export default Dashboard;
