"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function MessageInput({ onSend, disabled = false }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border-t border-gray-100 px-4 py-3"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Write a message"
        disabled={disabled}
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={disabled || !value.trim()}
        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
      >
        <Send className="mr-2 h-4 w-4" />
        Send
      </Button>
    </form>
  );
}
