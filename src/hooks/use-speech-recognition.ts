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
  const isListeningRef = useRef(false);

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
        isListeningRef.current = true;
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

        // Если есть финальный результат, отправляем его
        if (finalTranscript && onResult) {
          onResult(finalTranscript.trim());
        }
        // Если есть промежуточный результат и включен continuous, тоже отправляем для отображения
        else if (interimTranscript && continuous && onResult) {
          // Не отправляем промежуточные результаты, только финальные
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
            // При no-speech в continuous режиме не останавливаем, просто продолжаем слушать
            if (!continuous) {
              setIsListening(false);
            }
            return;
          case "audio-capture":
            errorMessage = "Микрофон не найден или недоступен.";
            setIsListening(false);
            break;
          case "not-allowed":
            errorMessage = "Доступ к микрофону запрещен. Разрешите доступ в настройках браузера.";
            setIsListening(false);
            break;
          case "network":
            errorMessage = "Ошибка сети при распознавании речи.";
            setIsListening(false);
            break;
          default:
            errorMessage = `Ошибка: ${event.error}`;
            setIsListening(false);
        }

        if (errorMessage !== "Произошла ошибка распознавания речи" || event.error !== "no-speech") {
          setError(errorMessage);
          if (onError) {
            onError(errorMessage);
          }
        }
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setIsListening(false);
        // Если continuous включен и мы все еще должны слушать, перезапускаем
        if (continuous && isListeningRef.current === false) {
          // Небольшая задержка перед перезапуском
          setTimeout(() => {
            if (recognitionRef.current && !isListeningRef.current) {
              try {
                isListeningRef.current = true;
                recognitionRef.current.start();
              } catch (e: any) {
                isListeningRef.current = false;
                // Игнорируем ошибки перезапуска (already started, aborted и т.д.)
                const errorMsg = e?.message || String(e) || "";
                if (!errorMsg.includes("already started") && 
                    !errorMsg.includes("aborted") &&
                    !errorMsg.includes("not started")) {
                  console.log("Recognition auto-restart skipped:", errorMsg);
                }
              }
            }
          }, 100);
        }
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

    // Если уже слушаем, не запускаем повторно
    if (isListeningRef.current) {
      return;
    }

    try {
      // Сначала полностью останавливаем и очищаем предыдущее распознавание
      try {
        if (recognitionRef.current) {
          recognitionRef.current.abort();
        }
      } catch (e) {
        // Игнорируем ошибки при очистке
      }
      
      // Задержка для полной очистки перед новым запуском
      setTimeout(() => {
        if (recognitionRef.current && !isListeningRef.current) {
          try {
            isListeningRef.current = true;
            recognitionRef.current.start();
          } catch (err: any) {
            isListeningRef.current = false;
            // Игнорируем ошибки "already started", "aborted", "not started"
            const errorMsg = err?.message || String(err) || "";
            if (!errorMsg.includes("already started") && 
                !errorMsg.includes("aborted") &&
                !errorMsg.includes("not started")) {
              console.error("Error starting recognition:", err);
              setError("Не удалось запустить распознавание речи");
              if (onError) {
                onError("Не удалось запустить распознавание речи");
              }
            }
          }
        }
      }, 200);
    } catch (err) {
      console.error("Error starting recognition:", err);
      isListeningRef.current = false;
    }
  };

  const stopListening = () => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error("Error stopping recognition:", err);
        }
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
