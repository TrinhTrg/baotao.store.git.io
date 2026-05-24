"use client";

import { useEffect, useRef } from "react";
import { Clock3, Store } from "lucide-react";

export default function MessageThread({
  messages = [],
  currentUserId,
  otherUser,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white/80 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600">
          {otherUser?.avatar ? (
            <img
              src={otherUser.avatar}
              alt={otherUser.name || "User"}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <Store className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {otherUser?.shopName || otherUser?.name || "Conversation"}
          </p>
          <p className="text-xs text-gray-500">Real-time messages</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((message) => {
          const isMine = message.sender?.toString() === currentUserId;
          const timeLabel = message.timestamp
            ? new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div
              key={message.id || message._id}
              className="flex flex-col gap-1"
            >
              <div
                className={`flex max-w-[85%] flex-col gap-2 rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  isMine
                    ? "self-end bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                    : "self-start bg-gray-100 text-gray-800"
                }`}
              >
                <p className="leading-relaxed">{message.content}</p>
                <div
                  className={`flex items-center gap-1 text-[11px] ${
                    isMine ? "text-orange-50/80" : "text-gray-500"
                  }`}
                >
                  <Clock3 className="h-3 w-3" />
                  <span>{timeLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
}
