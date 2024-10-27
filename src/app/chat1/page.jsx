"use client"
import React, { useState,useCallback, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, MessageSquare, Send, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Custom hook for translation functionality

const useTranslation = () => {
    const [translator, setTranslator] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const initializeOnMount = async () => {
            if (!translator) {
              await initializeTranslator("es", "en");
            }
          };
          initializeOnMount();
      }, [translator]);
  
      const initializeTranslator = useCallback(async (sourceLanguage, targetLanguage) => {
        try {
          setIsLoading(true);
          setError(null);
    
          const languagePair = { sourceLanguage, targetLanguage };
          const canTranslate = await translation.canTranslate(languagePair);
          let newTranslator;
    
          if (canTranslate !== "no") {
            if (canTranslate === "readily") {
              // The translator can immediately be used.
              newTranslator = await translation.createTranslator(languagePair);
            } else {
              // The translator can be used after the model download.
              newTranslator = await translation.createTranslator(languagePair);
              newTranslator.addEventListener("downloadprogress", (e) => {
                console.log(e.loaded, e.total);
              });
              await newTranslator.ready;
            }
          } else {
            // The translator can't be used at all.
            throw new Error("Translation not supported");
          }
    
          setTranslator(newTranslator);
          return newTranslator;
        } catch (err) {
          setError(err.message);
          console.error("Translation initialization error:", err);
          return null;
        } finally {
          setIsLoading(false);
        }
      }, []);
  
      const translateText = useCallback(async (text, sourceLanguage, targetLanguage) => {
        try {
          if (!translator || 
              translator.sourceLanguage !== sourceLanguage || 
              translator.targetLanguage !== targetLanguage) {
            const newTranslator = await initializeTranslator(sourceLanguage, targetLanguage);
            if (!newTranslator) return text; // If translation fails, return original text
          }
    
          const translatedText = await translator.translate(text);
          return translatedText;
        } catch (err) {
          console.error("Translation error:", err);
          return text; // Return original text if translation fails
        }
      }, [translator, initializeTranslator]);
    
      return {
        translateText,
        isLoading,
        error,
        initializeTranslator,
      };
    };
  
const ChatInterface = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [activeChat, setActiveChat] = useState(null);

  const [translatedMessages, setTranslatedMessages] = useState({});
  const { translateText, isLoading, error, initializeTranslator } = useTranslation();

  useEffect(() => {
    if (activeChat && currentLanguage !== 'en') {
      translateChat();
    }
  }, [currentLanguage, activeChat]);

  const translateChat = async () => {
    if (!activeChat) return;
    
    const newTranslatedMessages = {};
    for (const message of activeChat.messages) {
      if (!translatedMessages[`${message.id}-${currentLanguage}`]) {
        const translatedText = await translateText(
          message.text,
          'en', // Assuming original messages are in English
          currentLanguage
        );
        newTranslatedMessages[`${message.id}-${currentLanguage}`] = translatedText;
      }
    }
    
    setTranslatedMessages(prev => ({
      ...prev,
      ...newTranslatedMessages
    }));
  };
// Modified message rendering function
const getMessageText = (message) => {
    if (currentLanguage === 'en') return message.text;
    return translatedMessages[`${message.id}-${currentLanguage}`] || message.text;
  };

  // Modified handleSendMessage
  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;

    const newMessage = {
      id: activeChat.messages.length + 1,
      sender: "You",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true
    };
    // console.log("New Message: "+JSON.stringify(newMessage))
    // console.log("Current Langauge: "+currentLanguage)
    // If current language is not English, store both versions
    if (currentLanguage !== 'en') {
      const translatedText = await translateText(
        message,
        'en',
        currentLanguage
      );
      setTranslatedMessages(prev => ({
        ...prev,
        [`${newMessage.id}-${currentLanguage}`]: translatedText
      }));
    }

    activeChat.messages.push(newMessage);
    activeChat.lastMessage = message;
    activeChat.time = newMessage.time;
    
    setMessage("");
  };


  const conversations = [
    { 
      id: 1, 
      name: "John Doe", 
      lastMessage: "Hello!", 
      time: "10:30 AM",
      messages: [
        { id: 1, sender: "John Doe", text: "Hello!", time: "10:30 AM", isSent: false },
        { id: 2, sender: "You", text: "Hi there!", time: "10:31 AM", isSent: true },
      ]
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      lastMessage: "How are you?", 
      time: "09:45 AM",
      messages: [
        { id: 1, sender: "Jane Smith", text: "How are you?", time: "09:45 AM", isSent: false },
        { id: 2, sender: "You", text: "I'm good, thanks!", time: "09:46 AM", isSent: true },
      ]
    },
  ];

  const languages =  [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ar", label: "Arabic" },
    { value: "bn", label: "Bengali" },
    { value: "hi", label: "Hindi" },
    { value: "it", label: "Italian" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "nl", label: "Dutch" },
    { value: "pl", label: "Polish" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "th", label: "Thai" },
    { value: "tr", label: "Turkish" },
    { value: "vi", label: "Vietnamese" },
    { value: "zh", label: "Chinese (Simplified)" },
    { value: "zh-Hant", label: "Chinese (Traditional)" },
  ];

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setIsSidebarOpen(false);
  };

//   const handleSendMessage = () => {
//     if (!message.trim() || !activeChat) return;

//     const newMessage = {
//       id: activeChat.messages.length + 1,
//       sender: "You",
//       text: message,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       isSent: true
//     };

//     activeChat.messages.push(newMessage);
//     activeChat.lastMessage = message;
//     activeChat.time = newMessage.time;
    
//     setMessage("");
//   };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50 my-3">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SidebarContent 
              conversations={conversations} 
              activeChat={activeChat}
              onChatSelect={handleChatSelect}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white shadow-lg">
        <SidebarContent 
          conversations={conversations} 
          activeChat={activeChat}
          onChatSelect={handleChatSelect}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {/* Chat Header */}
        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-black">
            {activeChat ? activeChat.name : "Select a chat"}
          </h2>
          {activeChat && (
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-gray-600">
                {languages.find(lang => lang.value === currentLanguage)?.label}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4">
                  <div className="space-y-3">
                    <div className="font-medium">Chat Settings</div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Translation Language</div>
                      <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6">
          {activeChat ? (
            <div className="space-y-6 max-w-3xl mx-auto">
              {activeChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 shadow-sm transition-all ${
                      msg.isSent
                        ? 'bg-black text-white'
                        : 'bg-white text-black'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">{msg.sender}</div>
                    <div className="text-[15px] leading-relaxed">
                        {getMessageText(msg)}
                        {isLoading && msg.id === activeChat.messages.length && (
                            <span className="text-xs ml-2 opacity-70">Translating...</span>
                        )}
                    </div>
                    <div className="text-xs mt-2 opacity-70">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        {activeChat && (
          <div className="p-6 bg-white shadow-lg">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-black rounded-xl py-6 text-[15px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                size="icon" 
                className="bg-black text-white hover:bg-gray-800 rounded-xl h-12 w-12 shadow-sm transition-colors"
                onClick={handleSendMessage}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sidebar Content Component
const SidebarContent = ({ conversations, activeChat, onChatSelect }) => (
  <div className="h-full flex flex-col bg-white">
    <div className="h-16 flex items-center px-6 shadow-sm">
      <h1 className="text-xl font-semibold text-black">Chats</h1>
    </div>
    <ScrollArea className="flex-1">
      <div className="p-3">
        {conversations.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className={`w-full p-3 rounded-xl flex items-center gap-3 transition-colors mb-1
              ${activeChat?.id === chat.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
          >
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-[15px]">{chat.name}</div>
              <div className="text-sm text-gray-600 truncate">{chat.lastMessage}</div>
            </div>
            <div className="text-xs text-gray-500">{chat.time}</div>
          </button>
        ))}
      </div>
    </ScrollArea>
  </div>
);

export default ChatInterface;