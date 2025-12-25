import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi. Ask me about products, orders, or today’s totals.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [open, msgs.length]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const reply =
        text.toLowerCase().includes("help")
          ? "Try: 'How many orders today?', 'Total revenue?', 'List coffee products'."
          : "Demo AI is enabled. Next step: connect me to your backend AI endpoint.";

      setMsgs((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: "assistant", text: "Failed to respond." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* CHAT PANEL */}
      {open && (
        <div
          role="dialog"
          aria-label="AI Assistant"
          className="fixed bottom-24 right-6 w-80 h-[420px] bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col z-50"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div>
              <div className="text-sm font-semibold">AI Assistant</div>
              <div className="text-xs text-gray-500">POS helper</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* MESSAGES */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50"
          >
            {msgs.map((m, idx) => (
              <div
                key={idx}
                className={`
                  max-w-[85%] px-3 py-2 rounded-xl text-sm
                  ${
                    m.role === "user"
                      ? "ml-auto bg-gray-900 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }
                `}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="bg-white border border-gray-200 text-gray-500 text-sm px-3 py-2 rounded-xl w-fit">
                Typing…
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something…"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              onClick={send}
              disabled={loading}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition
                ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }
              `}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI chat"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gray-900 text-white font-semibold shadow-lg hover:bg-gray-800 transition z-40"
      >
        {open ? "—" : "AI"}
      </button>
    </>
  );
}
