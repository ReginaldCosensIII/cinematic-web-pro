import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';


interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isDark = true;

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1', role: 'assistant',
        content: "Hi! I'm your web development assistant. I can help you with technical questions, discuss your project needs, and guide you through our services. How can I help you today?",
        timestamp: new Date(),
      }]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    try {
      const conversationHistory = messages.map(msg => ({ role: msg.role, content: msg.content }));
      const { data, error } = await supabase.functions.invoke('ai-chatbot', { body: { message: inputValue, conversationHistory } });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.message, timestamp: new Date() }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const toggleChat = () => { setIsOpen(!isOpen); setIsMinimized(false); };

  if (!isOpen) {
    return (
      <div className="fixed bottom-20 right-6 z-50">
        <button
          onClick={toggleChat}
          className="chatbot-bubble w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple"
          aria-label="Open chat"
        >
          <Bot className="w-6 h-6 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <div className={`glass-effect rounded-2xl transition-all duration-300 ${isMinimized ? 'w-80 h-14' : 'w-80 h-[26rem]'}`}>
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="icon-badge-3d w-8 h-8 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-wdp-text font-medium text-sm">Web Dev Assistant</h3>
              <p className="text-wdp-text-secondary text-xs">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {isMinimized ? (
              <Button onClick={() => setIsMinimized(false)} variant="ghost" size="sm" className="w-8 h-8 p-0 text-wdp-text-secondary hover:text-wdp-text">
                <Maximize2 className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={() => setIsMinimized(true)} variant="ghost" size="sm" className="w-8 h-8 p-0 text-wdp-text-secondary hover:text-wdp-text">
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
            <Button onClick={toggleChat} variant="ghost" size="sm" className="w-8 h-8 p-0 text-wdp-text-secondary hover:text-wdp-text">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isMinimized ? null : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? (isDark ? 'bg-webdev-darker-gray' : 'bg-blue-100')
                        : 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple'
                    }`}>
                      {message.role === 'user'
                        ? <User className={`w-3 h-3 ${isDark ? 'text-wdp-text' : 'text-blue-600'}`} />
                        : <Bot className="w-3 h-3 text-white" />
                      }
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.role === 'user'
                        ? (isDark ? 'bg-webdev-darker-gray text-wdp-text' : 'bg-blue-50 text-wdp-text')
                        : (isDark ? 'bg-webdev-darker-gray/50 text-wdp-text-secondary' : 'bg-gray-50 text-wdp-text')
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className={`rounded-lg p-3 ${isDark ? 'bg-webdev-darker-gray/50' : 'bg-gray-50'}`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-wdp-text-secondary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-wdp-text-secondary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-wdp-text-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <Input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about web development..." disabled={isLoading} />
                <Button onClick={sendMessage} disabled={!inputValue.trim() || isLoading} variant="glass" className="px-3 py-2 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
