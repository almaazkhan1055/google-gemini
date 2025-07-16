"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomeScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-white md:text-3xl text-xl">
        Welcome, please Sign in to start the chat!
      </h1>
    </div>
  );
};

export default HomeScreen;
