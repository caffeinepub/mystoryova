import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ChatbotEntry } from "../backend";
import { useGetAllChatbotEntries } from "../hooks/useQueries";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

function findAnswer(entries: ChatbotEntry[], input: string): string {
  const lower = input.toLowerCase();
  for (const entry of entries) {
    const keywords = entry.question.toLowerCase().split(/\s+/);
    const matchCount = keywords.filter(
      (k) => k.length > 3 && lower.includes(k),
    ).length;
    if (matchCount >= 2 || lower.includes(entry.question.toLowerCase()))
      return entry.answer;
  }
  return "I'll pass your question to O. Chiddarwar. Thank you for your curiosity — every question inspires the next story.";
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "bot",
      text: "Welcome! I'm here to answer questions about O. Chiddarwar's books. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const { data: entries = [] } = useGetAllChatbotEntries();
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages.length]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const ts = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { id: `u-${ts}`, role: "user", text },
      { id: `b-${ts}`, role: "bot", text: findAnswer(entries, text) },
    ]);
    setInput("");
  };

  return (
    <>
      <button
        type="button"
        data-ocid="chatbot.button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-gold flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        aria-label="Open chatbot"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
      {open && (
        <div
          data-ocid="chatbot.modal"
          className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl glass shadow-cinematic flex flex-col overflow-hidden"
          style={{ height: "420px" }}
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Ask the Author
              </p>
              <p className="text-xs text-muted-foreground">
                O. Chiddarwar's assistant
              </p>
            </div>
          </div>
          <ScrollArea className="flex-1 px-4 py-3">
            <div className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground" : "glass text-foreground"}`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
          <div className="px-3 py-3 border-t border-white/10 flex gap-2">
            <Input
              data-ocid="chatbot.input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 text-sm h-9 bg-muted/50 border-white/10"
            />
            <Button
              data-ocid="chatbot.primary_button"
              onClick={handleSend}
              size="sm"
              className="h-9 px-3 bg-primary text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
