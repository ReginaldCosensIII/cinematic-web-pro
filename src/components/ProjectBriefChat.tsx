import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Download, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ProjectBriefChatProps {
  onBriefGenerated?: (brief: string) => void;
}

const ProjectBriefChat = ({ onBriefGenerated }: ProjectBriefChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm here to help you create a professional project brief for your website or web application. I'll guide you through some questions to understand your needs and goals. Let's start with the basics - what type of website or application are you looking to build?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const { data, error } = await supabase.functions.invoke('project-brief-ai', {
        body: {
          message: inputValue,
          conversationHistory,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateBrief = async () => {
    setIsGeneratingBrief(true);
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const { data, error } = await supabase.functions.invoke('project-brief-ai', {
        body: {
          message: 'Please generate a comprehensive project brief based on our entire conversation.',
          conversationHistory,
          generateBrief: true,
        },
      });

      if (error) throw error;

      const briefMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, briefMessage]);
      onBriefGenerated?.(data.message);
    } catch (error) {
      console.error('Brief generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate brief. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const downloadBrief = () => {
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistantMessage) return;

    const blob = new Blob([lastAssistantMessage.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-brief.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const restartBrief = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Hi! I'm here to help you create a professional project brief for your website or web application. I'll guide you through some questions to understand your needs and goals. Let's start with the basics - what type of website or application are you looking to build?",
      timestamp: new Date(),
    }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="glass-effect h-[600px] flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? (isDark ? 'bg-webdev-darker-gray' : 'brief-chat-user-avatar bg-blue-100')
                    : 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple'
                }`}>
                  {message.role === 'user' ? (
                    <User className={`w-4 h-4 ${isDark ? 'text-webdev-silver' : 'text-blue-600'}`} />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-lg p-4 ${
                  message.role === 'user'
                    ? (isDark ? 'bg-webdev-darker-gray text-webdev-silver' : 'brief-chat-user-msg bg-blue-50 text-wdp-text')
                    : (isDark ? 'bg-webdev-darker-gray/50 text-webdev-soft-gray' : 'brief-chat-bot-msg bg-gray-50 text-wdp-text')
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className={`rounded-lg p-4 ${isDark ? 'bg-webdev-darker-gray/50' : 'bg-gray-50'}`}>
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

        {/* Actions */}
        {messages.length > 4 && (
          <div className="p-4 border-t border-border">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                onClick={generateBrief}
                disabled={isGeneratingBrief}
                variant="glass"
              >
                {isGeneratingBrief ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Final Brief'
                )}
              </Button>
              <Button
                onClick={downloadBrief}
                variant="glass"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={restartBrief}
                variant="glass"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              variant="glass"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectBriefChat;
