"use client";
import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { addMessage, simulateAiResponse } from "@/redux/slices/messageSlice";
import { MdDeleteOutline } from "react-icons/md";

const Prompt = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const chatroomId = pathname.startsWith("/chatroom/")
    ? pathname.split("/chatroom/")[1]
    : null;

  const [input, setInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSend = () => {
    if (!chatroomId || (!input.trim() && !selectedImage)) return;

    const message = {
      role: "user",
      text: input.trim(),
      image: selectedImage,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage({ chatroomId, message }));
    dispatch(
      simulateAiResponse({
        chatroomId,
        userMessage: input || "📸 image",
      })
    );

    setInput("");
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  if (!chatroomId) return null;

  return (
    <div className="w-full border border-gray-600 rounded-xl p-4 md:p-5 flex flex-col gap-4 bg-[#1f1f1f] text-white shadow-lg max-md:mb-[12px] mb-4">
      {/* Image Preview */}
      {selectedImage && (
        <div className="flex items-center justify-between gap-4 border border-gray-500 rounded-md p-2">
          <img
            src={selectedImage}
            alt="preview"
            className="w-20 h-20 object-cover rounded-md border"
          />
          <button
            onClick={() => {
              setSelectedImage(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="text-red-400 hover:text-red-600 transition"
            title="Remove image"
          >
            <MdDeleteOutline size={26} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-4 w-full">
        <label className="cursor-pointer flex items-center justify-center w-10 h-10 bg-gray-700 rounded-lg hover:bg-gray-600 transition shrink-0">
          <FaPlus size={18} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        <input
          type="text"
          placeholder="Ask Gemini..."
          className="min-w-0 flex-1 p-2 sm:p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          className="p-2 sm:p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition shrink-0"
          title="Send"
        >
          <IoSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default Prompt;
