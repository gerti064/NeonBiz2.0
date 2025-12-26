import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

// ✅ Droplet IP (no domain needed)
const API_BASE = "http://138.197.183.95:4000";

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
      const r = await fetch(`${API_BASE}/api/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const data = await r.json().catch(() => ({}));

      const reply =
        (data && typeof data.answer === "string" && data.answer.trim()) ||
        (data && typeof data.error === "string" && data.error.trim()) ||
        (r.ok ? "No response." : `Request failed (${r.status}).`);

      setMsgs((m) => [...m, { role: "assistant", text: reply }]);
    } catch (err: any) {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          text: `Failed to respond: ${err?.message ?? "Network error"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="AI Assistant"
          className="fixed bottom-24 right-6 w-80 h-[420px] bg-white border border-gray-200 rounded-2xl shadow-xl flex flex-col z-50"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div>
              <div className="text-sm font-semibold">AI Assistant</div>
              <div className="text-xs text-gray-500">POS helper</div>
            </div>
            <button
              className="aiIconBtn"
              onClick={() => setOpen(false)}
              aria-label="Close"
              type="button"
            >
              ✕
            </button>
          </div>

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

          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something…"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              disabled={loading}
            />
            <button
              className="aiSendBtn"
              onClick={send}
              disabled={loading}
              type="button"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button
        className="aiFab"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI chat"
        type="button"
      >
        {open ? "—" : "AI"}
      </button>
    </>
  );
}
