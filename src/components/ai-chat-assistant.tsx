"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Mic, MicOff } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideButton?: boolean;
  startWithVoice?: boolean;
}

export default function AIChatAssistant({ isOpen: externalIsOpen, onOpenChange, hideButton = false, startWithVoice = false }: AIChatAssistantProps = {}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Привет! Я ваш ИИ-помощник. Чем могу помочь?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Голосовое распознавание
  const { isListening, isSupported, error: speechError, startListening, stopListening } = useSpeechRecognition({
    onResult: (text) => {
      setInputValue((prev) => prev ? prev + " " + text : text);
    },
    onError: (error) => {
      console.error("Speech recognition error:", error);
    },
    language: "ru-RU",
    continuous: false,
    interimResults: false,
  });

  // Автозапуск голосового ввода если startWithVoice
  useEffect(() => {
    if (isOpen && startWithVoice && isSupported && !isListening) {
      const timer = setTimeout(() => {
        startListening();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, startWithVoice, isSupported]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Останавливаем распознавание, если оно активно
    if (isListening) {
      stopListening();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Здесь будет вызов API для ИИ-ассистента
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Извините, произошла ошибка. Попробуйте еще раз.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Извините, не удалось получить ответ. Попробуйте позже.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      {/* Кнопка для открытия чата - показываем только если не скрыта и управляется внутренне */}
      {!hideButton && externalIsOpen === undefined && (
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsOpen(true)}
              className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
              aria-label="Открыть чат-помощник"
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {/* Окно чата */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`fixed z-[101] bg-[#0A0A0A]/95 border border-white/10 shadow-2xl flex flex-col overflow-hidden ${
                isMobile
                  ? "inset-0 rounded-none"
                  : "bottom-6 right-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] rounded-2xl"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Заголовок */}
              <div className="flex items-center justify-between p-3 md:p-4 border-b border-white/10 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xs md:text-sm font-semibold text-white">ИИ-Помощник</h3>
                    <p className="text-[10px] md:text-xs text-white/60">Всегда готов помочь</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Закрыть чат"
                >
                  <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>

              {/* Область сообщений */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 md:gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] md:max-w-[80%] rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-2 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-white/10 text-white/90 border border-white/20"
                      }`}
                    >
                      <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                        <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/70" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 md:gap-3 justify-start">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                    <div className="bg-white/10 text-white/90 border border-white/20 rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Поле ввода */}
              <div className="p-3 md:p-4 border-t border-white/10 bg-[#0A0A0A]/50">
                {speechError && (
                  <div className="mb-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-xs">
                    {speechError}
                  </div>
                )}
                <div className="flex gap-2">
                  {isSupported && (
                    <button
                      onClick={() => {
                        if (isListening) {
                          stopListening();
                        } else {
                          startListening();
                        }
                      }}
                      className={`flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg transition-all ${
                        isListening
                          ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                          : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                      aria-label={isListening ? "Остановить запись" : "Начать голосовой ввод"}
                      title={isListening ? "Остановить запись" : "Голосовой ввод"}
                    >
                      {isListening ? (
                        <MicOff className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      ) : (
                        <Mic className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      )}
                    </button>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Говорите..." : "Напишите сообщение..."}
                    disabled={isLoading || isListening}
                    className="flex-1 px-3 md:px-4 py-2 bg-white/5 border border-white/30 rounded-lg text-white text-xs md:text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors disabled:opacity-50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim() || isListening}
                    className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Отправить сообщение"
                  >
                    <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </button>
                </div>
                {isListening && (
                  <div className="mt-2 flex items-center gap-2 text-purple-400 text-xs">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Идет запись... Говорите</span>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

