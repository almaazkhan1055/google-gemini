"use client";
import { useDispatch, useSelector } from "react-redux";
import { deleteChatroom } from "../../redux/slices/chatRoomSlice.js";
import toast from "react-hot-toast";
import Link from "next/link.js";
import { useRouter } from "next/navigation.js";
import { MdDeleteOutline } from "react-icons/md";
import { useState, useMemo } from "react";

const ChatroomList = ({ sidebarOpen, isSearching }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const chatrooms = useSelector((state) => state.chatroom.chatrooms);
  const [search, setSearch] = useState("");

  const handleDelete = (id) => {
    dispatch(deleteChatroom(id));

    const messages = JSON.parse(localStorage.getItem("messages") || "{}");
    delete messages[id];
    localStorage.setItem("messages", JSON.stringify(messages));

    const savedRooms = JSON.parse(localStorage.getItem("chatrooms") || "[]");
    const updatedChatrooms = savedRooms.filter((room) => room.id !== id);
    localStorage.setItem("chatrooms", JSON.stringify(updatedChatrooms));

    toast.success("Chatroom deleted!");
    router.push("/dashboard");
  };

  const filteredChatrooms = useMemo(() => {
    const query = search.toLowerCase();
    return chatrooms.filter((room) => room.title.toLowerCase().includes(query));
  }, [search, chatrooms]);

  return (
    <div className="text-white w-full max-w-xl mx-auto max-md:p-5">
      {isSearching && (
        <input
          type="text"
          placeholder="Search chatrooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full p-2 mb-4 rounded text-white border border-white  ${
            !sidebarOpen && "max-md:hidden"
          }`}
        />
      )}

      <div className="flex justify-between mb-4">
        <h2
          className={`text-sm text-[#a2a9b0] font-semibold ${
            !sidebarOpen && "max-md:hidden"
          }`}
        >
          Recent
        </h2>
      </div>

      <ul className={`${!sidebarOpen && "max-md:hidden"}`}>
        {filteredChatrooms.map((room) => (
          <li
            key={room.id}
            className={`flex justify-between items-center gap-2 ${
              sidebarOpen ? "p-4" : "py-2"
            } rounded truncate`}
          >
            <Link href={`/chatroom/${room.id}`} className="flex-1">
              {room.title}
            </Link>
            <button
              onClick={() => handleDelete(room.id)}
              className="text-red-500 cursor-pointer hover:underline"
              aria-label="Delete chatroom"
            >
              <MdDeleteOutline size={24} />
            </button>
          </li>
        ))}
        {filteredChatrooms.length === 0 && (
          <li className="text-gray-400 italic">No chatrooms found.</li>
        )}
      </ul>
    </div>
  );
};

export default ChatroomList;
