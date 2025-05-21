
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

const MOCK_CHATS = {
  "1": {
    id: "1",
    psychologistId: "1",
    psychologistName: "Dra. Emma Wilson",
    patientId: "2",
    patientName: "João Silva",
    messages: [
      {
        id: "1",
        senderId: "1",
        content: ".....",
        timestamp: new Date(Date.now() - 86400000),
      },
      {
        id: "2",
        senderId: "2",
        content: ".....",
        timestamp: new Date(Date.now() - 86400000),
      }
    ],
  },
  "2": {
    id: "2",
    psychologistId: "3",
    psychologistName: "Dra. Sophia Martinez",
    patientId: "1",
    patientName: "João Silva",
    messages: [
      {
        id: "1",
        senderId: "3",
        content: ".............",
        timestamp: new Date(Date.now() - 172800000),
      },
      {
        id: "2",
        senderId: "1",
        content: ".............",
        timestamp: new Date(Date.now() - 172800000),
      },
    ],
  },
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatMessageDate = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Hoje";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Ontem";
  } else {
    return date.toLocaleDateString();
  }
};

const Chat = () => {
  const { id: chatId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState<any>(MOCK_CHATS[chatId as keyof typeof MOCK_CHATS]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);
  
  if (!chat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Conversa Não Encontrada</h1>
          <p className="mb-6">A conversa que você está procurando não existe ou foi removida.</p>
          <Button asChild>
            <Link to="/dashboard">Voltar para o Painel</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;
    
    const message = {
      id: `${chat.messages.length + 1}`,
      senderId: user.id,
      content: newMessage.trim(),
      timestamp: new Date(),
    };
    
    setChat({
      ...chat,
      messages: [...chat.messages, message],
    });
    
    setNewMessage("");
  };
  
  const groupedMessages: Record<string, typeof chat.messages> = {};
  chat.messages.forEach((message: any) => {
    const date = formatMessageDate(new Date(message.timestamp));
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header with navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="text-vivaleve-600 hover:text-vivaleve-700 flex items-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Voltar ao Painel
            </Link>
            
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-vivaleve-100 flex items-center justify-center mr-3">
                <span className="font-medium text-vivaleve-600">
                  {user?.id === chat.patientId 
                    ? chat.psychologistName.charAt(0) 
                    : chat.patientName.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="font-medium">
                  {user?.id === chat.patientId ? chat.psychologistName : chat.patientName}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {user?.id === chat.patientId ? "Psicólogo" : "Paciente"}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 7l-7 5 7 5V7z"></path>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                Vídeo
              </Button>
              <Button variant="outline" size="sm">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
                </svg>
                Ligar
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 min-h-[calc(100vh-200px)] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {Object.entries(groupedMessages).map(([date, messages]) => (
              <div key={date}>
                <div className="flex items-center my-4">
                  <Separator className="flex-grow" />
                  <span className="px-2 text-xs text-muted-foreground">{date}</span>
                  <Separator className="flex-grow" />
                </div>
                
                {messages.map((message: any) => {
                  const isSentByUser = message.senderId === user?.id;
                  return (
                    <div 
                      key={message.id}
                      className={`flex mb-4 ${isSentByUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] p-3 rounded-lg ${
                          isSentByUser 
                            ? 'bg-vivaleve-600 text-white rounded-br-none' 
                            : 'bg-muted rounded-bl-none'
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <div 
                          className={`text-xs mt-1 ${
                            isSentByUser ? 'text-vivaleve-100' : 'text-muted-foreground'
                          }`}
                        >
                          {formatTime(new Date(message.timestamp))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input Area */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Digite uma mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-vivaleve-600 hover:bg-vivaleve-700">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
