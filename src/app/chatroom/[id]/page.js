"use client";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useRef, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Prompt from "@/app/components/Prompt";

const ChatroomPage = () => {
  const { id } = useParams();
  const messages = useSelector((state) => state.messages[id] || []);
  const bottomRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopy = (msg) => {
    const content = msg.text || msg.image;
    if (!content) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(content).then(() => {
        toast.success("Copied to clipboard!");
      });
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="w-full md:max-w-3xl flex flex-col h-full md:h-[calc(100vh-100px)] overflow-hidden">
      <div className="overflow-y-auto pr-2 space-y-3 scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative p-3 rounded-lg w-fit max-w-[70%] break-words transition-all group ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-700 text-white"
            }`}
          >
            {msg.text && <p>{msg.text}</p>}
            {msg.image && (
              <img
                src={msg.image}
                alt="uploaded"
                className="mt-2 rounded max-w-[200px] max-h-[200px] object-cover"
              />
            )}
            <small className="text-xs opacity-60 block mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
            {hoveredIndex === index && (
              <button
                onClick={() => handleCopy(msg)}
                className="absolute top-1 right-1 text-xs bg-white text-black px-2 py-1 rounded shadow hover:bg-gray-200 transition"
              >
                📋 Copy
              </button>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-auto pt-2">
        <Prompt />
      </div>
    </div>
  );
};

export default ChatroomPage;
