import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { sendMessage as sendMessageApi, getChats, getmessages } from "../service/chat.api";

const Dashboard = () => {
    const chat = useChat();
    const user = useSelector((state) => state.auth.user);
    const [chats, setChats] = useState([]);
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [title, setTitle] = useState("New Chat");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    useEffect(() => {
        const loadChats = async () => {
            try {
                const data = await getChats();
                const backendChats = data.chats || [];
                setChats(backendChats);
            } catch (err) {
                console.error("Failed to load chats", err);
            }
        };

        loadChats();
        chat.initilizeSocketConnection();
    }, []);

    // 🔥 NEW: scroll container ref
    const containerRef = useRef(null);

    // 🔥 SMART AUTO SCROLL (ChatGPT style)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const isNearBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 100;

        if (isNearBottom) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);

    const generateTitle = (text) => {
        const trim = text.trim();
        if (!trim) return "New Chat";
        if (trim.length <= 40) return trim;
        return `${trim.slice(0, 37).trimEnd()}...`;
    };

    const openChat = async (selectedChat) => {
        if (!selectedChat) return;
        setChatId(selectedChat._id);
        setTitle(selectedChat.title || "New Chat");
        setIsSidebarOpen(false); // Close sidebar on mobile
        
        setLoading(true);
        try {
            const res = await getmessages(selectedChat._id);
            const loadedMessages = (res.messages || []).map((msg) => ({
                role: msg.role,
                text: msg.content,
            }));
            setMessages(loadedMessages);
        } catch (err) {
            console.error("Failed to open chat", err);
        } finally {
            setLoading(false);
        }
    };

    const createNewChat = () => {
        setMessages([]);
        setChatId(null);
        setTitle("New Chat");
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage = message.trim();
        const isNewChat = !chatId;

        // Show user message and typing indicator instantly
        setMessages((prev) => [
            ...prev,
            { role: "user", text: userMessage },
            { role: "ai", text: "", isTyping: true }
        ]);
        
        setMessage("");
        setLoading(true);

        try {
            const response = await sendMessageApi({
                chat: chatId,
                message: userMessage,
            });

            const aiText =
                response.AIMessage ||
                response.message ||
                "AI failed to generate response.";

            const receivedChat = response.chat;
            const newChatId = receivedChat?._id || chatId;
            const newTitle = response.title || (isNewChat ? generateTitle(userMessage) : title);

            setChatId(newChatId);
            setTitle(newTitle);

            // Replace typing indicator with real response
            setMessages((prev) => 
                prev.map((msg) => 
                    msg.isTyping 
                    ? { ...msg, text: aiText, isTyping: false } 
                    : msg
                )
            );

            setChats((prev) => {
                const existing = prev.find((chat) => chat._id === newChatId);
                const updated = { ...(existing || {}), _id: newChatId, title: newTitle };
                if (existing) {
                    return prev.map((chat) => (chat._id === newChatId ? updated : chat));
                }
                return [updated, ...prev];
            });
        } catch (err) {
            // Replace typing indicator with error
            setMessages((prev) => 
                prev.map((msg) => 
                    msg.isTyping 
                    ? { ...msg, text: "AI failed. Please try again.", isTyping: false } 
                    : msg
                )
            );
            console.error("Send failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-screen w-full bg-slate-950 text-slate-100 p-0 md:p-5 flex flex-col overflow-hidden">
            <div className="mx-auto flex h-full w-full max-w-6xl rounded-none border-0 border-slate-700 bg-slate-900/90 shadow-2xl overflow-hidden md:rounded-2xl md:border md:flex">
                
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-700 bg-slate-900 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                    <div className="flex items-center justify-between border-b border-slate-700 p-4 text-lg font-semibold text-white">
                        <span>Perplexity</span>
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-slate-400 hover:text-white md:hidden"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-2 p-3">
                        {chats.length === 0 ? (
                            <p className="text-xs text-slate-300">No chats yet. Start with a message.</p>
                        ) : (
                            chats.map((item, idx) => (
                                <button
                                    key={item._id || idx}
                                    onClick={() => openChat(item)}
                                    className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                                        chatId === item._id
                                            ? "bg-linear-to-r from-cyan-500 to-blue-500 text-slate-900"
                                            : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                                    }`}
                                >
                                    <div className="truncate">{item.title || "Untitled Chat"}</div>
                                </button>
                            ))
                        )}
                    </div>
                </aside>

                {/* Chat Section */}
                <section className="flex flex-1 flex-col min-h-0">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-700 p-3 md:p-4 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 md:hidden"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-lg md:text-xl font-bold truncate max-w-[150px] md:max-w-none">
                                    {title || "New Chat"}
                                </h1>
                                <p className="text-[10px] md:text-xs text-slate-400">
                                    {user?.username || "Guest"}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={createNewChat}
                            className="rounded-xl bg-cyan-500 px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-slate-900 hover:bg-cyan-400 transition-colors"
                        >
                            New Chat
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex flex-1 flex-col p-4 min-h-0">
                        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 min-h-0">
                            
                            {/* 🔥 SCROLL CONTAINER */}
                            <div
                                ref={containerRef}
                                className="flex-1 overflow-y-auto p-4 min-h-0"
                                style={{ scrollBehavior: "smooth" }}
                            >
                                <div className="flex flex-col gap-3">
                                    {messages.map((m, i) => (
                                        <div
                                            key={i}
                                            className={`max-w-[88%] ${
                                                m.role === "ai"
                                                    ? "self-start"
                                                    : "self-end text-right"
                                            }`}
                                        >
                                            <div
                                                className={`inline-block rounded-xl px-3 py-2 text-sm ${
                                                    m.role === "ai"
                                                        ? "bg-slate-700 text-slate-100"
                                                        : "bg-cyan-500 text-slate-900"
                                                }`}
                                            >
                                                {m.role === "ai" ? (
                                                    m.isTyping ? (
                                                        <div className="flex items-center gap-1 py-1 px-2">
                                                            <span className="typing-dot"></span>
                                                            <span className="typing-dot"></span>
                                                            <span className="typing-dot"></span>
                                                        </div>
                                                    ) : (
                                                        <div className="prose prose-invert break-words">
                                                            <ReactMarkdown>{m.text}</ReactMarkdown>
                                                        </div>
                                                    )
                                                ) : (
                                                    m.text
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Input */}
                        <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-900 p-3">
                            <div className="flex gap-2">
                                <textarea
                                    rows="1"
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    className="flex-1 max-h-32 resize-none rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400 transition-all scrollbar-hide"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={loading}
                                    className="h-10 self-end rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400 disabled:opacity-50 transition-colors shrink-0"
                                >
                                    {loading ? (
                                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    ) : "Send"}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-slate-400">
                                AI response sometimes may take a second. Please wait.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;