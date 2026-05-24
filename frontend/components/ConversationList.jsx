"use client";

import { MessageSquare, Store } from "lucide-react";

export default function ConversationList({
  conversations = [],
  activeId,
  onSelect,
  loading = false,
}) {
  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto rounded-2xl bg-white/80 p-3 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between px-2 pb-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          <MessageSquare className="h-4 w-4 text-orange-500" />
          Conversations
        </div>
        {loading && <span className="text-xs text-gray-500">Loading...</span>}
      </div>

      {!loading && conversations.length === 0 && (
        <div className="rounded-xl bg-orange-50/70 p-4 text-sm text-orange-700">
          No conversations yet. Start by messaging a seller.
        </div>
      )}

      {conversations.map((conversation) => {
        const other = conversation.otherUser || {};
        const preview = conversation.lastMessage?.content || "Say hello";
        const isActive = other.id === activeId;

        return (
          <button
            key={conversation.conversationId || other.id}
            type="button"
            onClick={() => onSelect && other.id && onSelect(other.id)}
            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
              isActive
                ? "border-orange-300 bg-orange-50/70"
                : "border-gray-100 bg-white hover:border-orange-200"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              {other.avatar ? (
                <img
                  src={other.avatar}
                  alt={other.name || "User avatar"}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <Store className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">
                  {other.shopName || other.name || "Shop"}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[11px] font-semibold text-white">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-gray-600">{preview}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
