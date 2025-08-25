import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";
import { useSnackbar } from "notistack";

const ChatWidget = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [selectedPlatformById, setSelectedPlatformById] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I can help with everything on this site: find games, list categories, prices/platforms, latest games, and answer questions about wishlist, cart, payments, privacy and terms.",
      results: [],
      suggestions: [
        "Recommend some games",
        "List categories",
        "Windows games under $20",
        "Show latest games",
        "What's in my wishlist?",
        "What's in my cart?",
        "Show my payments",
        "Privacy policy",
        "Terms & conditions",
        "Contact support",
      ],
      id: "welcome",
    },
  ]);
  const scrollRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isContactModalOpen]);

  // Persist chat
  useEffect(() => {
    try {
      localStorage.setItem(
        "yoyo_chat_messages",
        JSON.stringify(messages.slice(-50))
      );
    } catch (_) { }
  }, [messages]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("yoyo_chat_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) {
          setMessages(parsed);
        }
      }
    } catch (_) { }
  }, []);

  // Fetch welcome message from backend
  useEffect(() => {
    const fetchWelcome = async () => {
      try {
        const res = await axiosInstance.get(`/chat`);
        const data = res?.data || {};
        if (data?.reply || data?.suggestions) {
          setMessages([
            {
              role: "assistant",
              content: data.reply || messages[0]?.content,
              results: Array.isArray(data.results) ? data.results : [],
              suggestions: Array.isArray(data.suggestions)
                ? data.suggestions
                : messages[0]?.suggestions,
              id: "welcome-remote",
            },
          ]);
        }
      } catch (_) { }
    };
    if (
      isContactModalOpen &&
      messages.length === 1 &&
      messages[0]?.id === "welcome"
    ) {
      fetchWelcome();
    }
  }, [isContactModalOpen]);

  const sendMessage = async (opts = {}) => {
    const q = input.trim();
    if ((!q && !opts.q) || isLoading) return;
    const effectiveQ = opts.q || q;
    if (!opts.append) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: effectiveQ, id: Date.now() + "u" },
      ]);
    }
    setInput("");
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/chat`, {
        params: { q: effectiveQ, page: opts.page || 1, limit: 6 },
      });
      const data = res?.data || {};
      setLastQuery(data.q || effectiveQ);
      setPage(data.page || 1);
      setHasMore(Boolean(data.hasMore));
      if (opts.append) {
        setMessages((prev) => {
          const copy = [...prev];
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].role === "assistant") {
              copy[i] = {
                ...copy[i],
                content: data.reply || copy[i].content,
                results: [
                  ...(Array.isArray(copy[i].results) ? copy[i].results : []),
                  ...(Array.isArray(data.results) ? data.results : []),
                ],
                suggestions: Array.isArray(data.suggestions)
                  ? data.suggestions
                  : copy[i].suggestions,
              };
              return copy;
            }
          }
          return [
            ...copy,
            {
              role: "assistant",
              content: data.reply || "",
              results: Array.isArray(data.results) ? data.results : [],
              suggestions: Array.isArray(data.suggestions)
                ? data.suggestions
                : [],
              id: Date.now() + "a",
            },
          ];
        });
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply || "",
            results: Array.isArray(data.results) ? data.results : [],
            suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
            id: Date.now() + "a",
          },
        ]);
      }
    } catch (_) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't reach the assistant. Please try again.",
          results: [],
          id: Date.now() + "e",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div>
      {/* Floating button */}
      {!isContactModalOpen && (
        <button
          onClick={() => setIsContactModalOpen(true)}
          className="fixed bottom-12 md:bottom-6 right-6 z-50 rounded-full p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:scale-105 transition"
        >
          💬
        </button>
      )}

      {/* Modal */}
      {isContactModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsContactModalOpen(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 z-50 w-full sm:bottom-6 sm:right-6 sm:left-auto sm:w-full sm:max-w-sm">
            <div
              className="rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[100dvh] sm:h-[70vh] relative 
                 bg-black/50 backdrop-blur-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 sticky top-0">
                <button
                  className="text-white hover:scale-110 transition"
                  onClick={() => setIsContactModalOpen(false)}
                >
                  <IoArrowBack className="w-6 h-6" />
                </button>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-lg">
                    Chat With Us
                  </span>
                  <span className="text-white/70 text-xs">
                    Replies within a few hours
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    <div className="max-w-[80%] sm:max-w-[75%]">
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-lg whitespace-pre-wrap
                        ${m.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none"
                            : "bg-white/10 backdrop-blur-md text-gray-200 border border-white/10 rounded-bl-none"
                          }`}
                      >
                        {m.role !== "user" && (
                          <div className="text-xs text-blue-300 mb-1">
                            Support
                          </div>
                        )}
                        {m.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 rounded-2xl shadow-lg bg-white/10 text-gray-200 border border-white/10 rounded-bl-none">
                      Thinking...
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-white/10 p-3 bg-black/40 backdrop-blur-xl sticky bottom-0">
                <div className="flex items-center gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 resize-none rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 px-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-28 text-sm"
                    rows={1}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 
                       hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 shadow-lg transition disabled:opacity-50"
                  >
                    <FaPaperPlane className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWidget;
