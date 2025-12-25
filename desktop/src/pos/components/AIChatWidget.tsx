import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Hi. Ask me about products, orders, or today’s totals." },
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
      const r = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const data = await r.json();

      const reply =
        (data && typeof data.answer === "string" && data.answer.trim()) ||
        (data && typeof data.error === "string" && data.error.trim()) ||
        "No response.";

      setMsgs((m) => [...m, { role: "assistant", text: reply }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", text: "Failed to respond." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="aiWrap">
      {open && (
        <div className="aiPanel" role="dialog" aria-label="AI Assistant">
          <div className="aiHeader">
            <div>
              <div className="aiTitle">AI Assistant</div>
              <div className="aiSub">POS helper</div>
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

          <div className="aiList" ref={listRef}>
            {msgs.map((m, idx) => (
              <div key={idx} className={`aiMsg ${m.role === "user" ? "aiUser" : "aiBot"}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="aiMsg aiBot">Typing…</div>}
          </div>

          <div className="aiInputRow">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something…"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              disabled={loading}
            />
            <button className="aiSendBtn" onClick={send} disabled={loading} type="button">
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
    </div>
  );
}
