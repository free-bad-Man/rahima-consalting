"use client";

import { useState, useEffect, useRef } from "react";

interface UseSpeechRecognitionOptions {
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

export function useSpeechRecognition({
  onResult,
  onError,
  language = "ru-RU",
  continuous = false,
  interimResults = false,
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const windowWithSpeech = window as WindowWithSpeechRecognition;
    const SpeechRecognition =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript && onResult) {
          onResult(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // Игнорируем ошибку "aborted" - это нормально при остановке
        if (event.error === "aborted") {
          setIsListening(false);
          return;
        }

        let errorMessage = "Произошла ошибка распознавания речи";
        
        switch (event.error) {
          case "no-speech":
            // Не показываем ошибку для no-speech, просто останавливаем
            setIsListening(false);
            return;
          case "audio-capture":
            errorMessage = "Микрофон не найден или недоступен.";
            break;
          case "not-allowed":
            errorMessage = "Доступ к микрофону запрещен. Разрешите доступ в настройках браузера.";
            break;
          case "network":
            errorMessage = "Ошибка сети при распознавании речи.";
            break;
          default:
            errorMessage = `Ошибка: ${event.error}`;
        }

        setError(errorMessage);
        setIsListening(false);
        if (onError) {
          onError(errorMessage);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
      setError("Распознавание речи не поддерживается в вашем браузере. Используйте Chrome, Edge или Safari.");
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Игнорируем ошибки при очистке
        }
      }
    };
  }, [language, continuous, interimResults, onResult, onError]);

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) {
      setError("Распознавание речи не поддерживается");
      return;
    }

    // Предотвращаем множественные запуски
    if (isListening) {
      return;
    }

    try {
      // Останавливаем предыдущее распознавание если оно было
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Игнорируем ошибки остановки
      }
      
      // Небольшая задержка перед запуском нового
      setTimeout(() => {
        if (recognitionRef.current && !isListening) {
          try {
            recognitionRef.current.start();
          } catch (err: any) {
            // Игнорируем ошибку "already started"
            if (err?.message && !err.message.includes("already started") && !err.message.includes("aborted")) {
              setError("Не удалось запустить распознавание речи");
              if (onError) {
                onError("Не удалось запустить распознавание речи");
              }
            }
          }
        }
      }, 100);
    } catch (err) {
      console.error("Error starting recognition:", err);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        if (isListening) {
          recognitionRef.current.stop();
        } else {
          recognitionRef.current.abort();
        }
      } catch (err) {
        console.error("Error stopping recognition:", err);
      }
    }
  };

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
  };
}
