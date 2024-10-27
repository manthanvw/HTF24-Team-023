"use client"
import React, { useState,useCallback, useEffect, use } from 'react';
import { createClient } from '@supabase/supabase-js';
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

const supabaseUrl = 'https://vnndbhnaytdphummfyeq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZubmRiaG5heXRkcGh1bW1meWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NjM5NjYsImV4cCI6MjA0NTUzOTk2Nn0.c6BleR5T5C4GsO7W-Ggk5Zd0l9LhSgEUx_TgJdFhlmw';
const supabase = createClient(supabaseUrl, supabaseKey);


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
    const [messages, setMessages] = useState([]);
    const { translateText, isLoading, error, initializeTranslator } = useTranslation();
    const [userMap, setUserMap] = useState(new Map());
    const [conversations, setConversations] = useState([]); 
    const [allMessages, setAllMessages] = useState([]);
    const [user, setUser] = useState("4be33c1e-d16b-4db9-b927-95194fcc0243")

    useEffect(() => {
        const fetchData = async () => {
          await fetchUsers();
          await fetchConversations();
        };
        fetchData();
      }, []);


    //   useEffect(() => {
    //     const fetchData = async () => {
    //       if (activeChat) {
    //         // listenForMessages();
    //       }
    //     };
    //     fetchData();
    //   }, [activeChat]);
    


    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*');
        
            if (error) {
                console.error("Error fetching users:", error);
                return;
            }
        
            data.forEach(user => {
                userMap.set(user.id, {
                    created_at: user.created_at,
                    username: user.username,
                    email: user.email,
                    'Full Name': user['Full Name']
                });
            });
        
            setUserMap(userMap);    
        } catch (error) {
            throw new Error("Error fetching users:", error);   
        }
    };
    

    const fetchConversations = async () => {
        const userId = "4be33c1e-d16b-4db9-b927-95194fcc0243"; // Get current user ID
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('created_at', { ascending: false });
    
        if (error) {
            console.error('Error fetching conversations:', error);
        } else {
            const uniqueUsers = {};
            
            data.forEach(msg => {
                const chatUserId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
                
                if (!uniqueUsers[chatUserId]) {
                    uniqueUsers[chatUserId] = {
                        id: chatUserId,
                        username: userMap.get(chatUserId).username,
                        'Full Name': userMap.get(chatUserId)['Full Name'],
                    };
                }
            });
    
            // Set the unique users to the state (for sidebar display)
            setConversations(Object.values(uniqueUsers));
            data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            setAllMessages(data)
            console.log(data)
        }
    };
    


    // Listen for new messages
    // const listenForMessages = () => {
    //     const subscription = supabase
    //     .from(`messages:receiver_id=eq.${user}`)
    //     .on("INSERT", (payload) => {
    //         // Add the new message to the state
    //         setMessages((prevMessages) => [...prevMessages, payload.new]);
    //     })
    //     .subscribe();

    //     return () => {
    //     supabase.removeSubscription(subscription);
    //     };
    // };
     // Handle sending messages
     const handleSendMessage = async () => {
        if (!message.trim() || !activeChat) return;
      
        // Translate message before sending
        let translatedMessage = message;
        if (currentLanguage !== "en") {
          translatedMessage = await translateText(message, "en", currentLanguage);
        }
      
        const { data, error } = await supabase
          .from("messages")
          .insert([
            {
              sender_id: user,
              receiver_id: activeChat.id,
              content: translatedMessage,
            },
          ])
          .select("id");
      
        if (error) {
          console.error("Error sending message:", error);
          return;
        }
      
        const newMessageId = data[0].id;
      
        // Update UI with the translated message
        setMessage(""); // Clear input
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: newMessageId,
            sender_id: user,
            receiver_id: activeChat.id,
            content: translatedMessage,
            created_at: new Date().toISOString(),
          },
        ]);
      };
      

  const translateChat = async () => {
    if (!activeChat) return;
    
    const translatedText = await translateText(
        message,
        'en', // Assuming original messages are in English
        currentLanguage
    ).then(translatedText =>setMessage(translatedText));
    
  };
// Modified message rendering function
 

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
      console.log(allMessages)
      console.log(chat);
    const chatMessages = allMessages.filter(
      (msg) => msg.sender_id === chat.id || msg.receiver_id === chat.id
    );
    setMessages(chatMessages);
  };


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
                {languages.find((lang) => lang.value === currentLanguage)?.label}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100 transition-colors">
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
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === user ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm transition-all ${msg.sender_id === user ? 'bg-black text-white' : 'bg-white text-black'}`}>
                    <div className="font-medium text-sm mb-1">{msg.sender_id === user ? "You" : userMap.get(msg.sender_id)["Full Name"]}</div>
                    <div className="text-[15px] leading-relaxed">
                      {msg.content}
                      {isLoading && msg.id === messages.length && (
                        <span className="text-xs ml-2 opacity-70">Translating...</span>
                      )}
                    </div>
                    <div className="text-xs mt-2 opacity-70">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
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
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
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
    <div className="p-6">
      <h3 className="text-lg font-semibold">Conversations</h3>
      <ul className="space-y-4 mt-4">
        {conversations.map((chat) => (
          <li key={chat.id} className={`cursor-pointer ${activeChat?.id === chat.id ? "font-semibold text-blue-600" : "text-black"}`} onClick={() => onChatSelect(chat)}>
            {chat['Full Name'] || chat.username}
          </li>
        ))}
      </ul>
    </div>
  );
  

export default ChatInterface;