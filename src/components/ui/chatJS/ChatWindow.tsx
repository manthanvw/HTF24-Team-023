"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Phone, 
  Video, 
  Info, 
  Plus, 
  Image as ImageIcon, 
  Paperclip, 
  Smile, 
  ThumbsUp,
  Menu,
  X
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: string;
  isCurrentUser: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status?: string;
}

const MessengerExample = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      content: 'It has been good. I went for a run this morning and then had a nice breakfast. How about you?',
      sender: {
        id: '1',
        name: 'Jane Doe',
        avatar: '/api/placeholder/32/32'
      },
      timestamp: '10:10 AM',
      isCurrentUser: false
    },
    {
      id: '2',
      content: 'Awesome! I am just chilling outside.',
      sender: {
        id: '2',
        name: 'John Doe',
        avatar: '/api/placeholder/32/32'
      },
      timestamp: '8:16 PM',
      isCurrentUser: true
    }
  ]);

  const chatUsers: User[] = [
    { id: '1', name: 'Jane Doe', avatar: '/api/placeholder/32/32', status: 'Active 2 mins ago' },
    { id: '2', name: 'John Doe', avatar: '/api/placeholder/32/32' },
    { id: '3', name: 'Elizabeth Smith', avatar: '/api/placeholder/32/32' },
    { id: '4', name: 'John Smith', avatar: '/api/placeholder/32/32' }
  ];

  // Sidebar content component
  const SidebarContent = () => (
    <div className="h-full bg-black">
      <div className="p-4">
        <div className="space-y-2">
          {chatUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.name}</div>
                {user.status && (
                  <div className="text-sm text-gray-400">{user.status}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-black text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-72 border-r border-gray-800">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Chats (4)</h1>
        </div>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden absolute top-4 left-4"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-black border-r border-gray-800">
          <SheetHeader className="p-4 text-left">
            <SheetTitle className="text-2xl font-bold text-white">Chats (4)</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center space-x-3 md:ml-0 ml-12">
            <Avatar>
              <AvatarImage src="/api/placeholder/32/32" alt="Jane Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Jane Doe</div>
              <div className="text-sm text-gray-400">Active 2 mins ago</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Phone className="h-5 w-5" />
              <span className="sr-only">Start call</span>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Video className="h-5 w-5" />
              <span className="sr-only">Start video</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
              <span className="sr-only">View info</span>
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isCurrentUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`flex items-end space-x-2 max-w-[85%] sm:max-w-[70%]`}>
                  {!message.isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                      <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.isCurrentUser
                          ? 'bg-white text-black'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add attachment</span>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <ImageIcon className="h-5 w-5" />
              <span className="sr-only">Add image</span>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Add file</span>
            </Button>
            <Input
              className="flex-1 bg-gray-800 border-0 focus-visible:ring-1 focus-visible:ring-white"
              placeholder="Type a message..."
              aria-label="Type a message"
            />
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
              <span className="sr-only">Add emoji</span>
            </Button>
            <Button variant="ghost" size="icon">
              <ThumbsUp className="h-5 w-5" />
              <span className="sr-only">Send thumbs up</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessengerExample;