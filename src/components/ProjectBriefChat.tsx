import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Download, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
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
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('project-brief-ai', {
        body: {
          message: inputValue,
          conversationHistory
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

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
        description: "Failed to send message. Please try again.",
        variant: "destructive"
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
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('project-brief-ai', {
        body: {
          message: "Based on our conversation, please generate a comprehensive, well-formatted project brief that summarizes all the requirements, features, timeline, and other details we've discussed. Format it professionally as if it's a document that could be submitted to a development team.",
          conversationHistory
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      const briefMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, briefMessage]);
      
      if (onBriefGenerated) {
        onBriefGenerated(data.message);
      }

      // Send email notification in the background
      try {
        await supabase.functions.invoke('notify-project-brief', {
          body: {
            briefContent: data.message,
            conversationHistory: [...conversationHistory, {
              role: 'user',
              content: "Based on our conversation, please generate a comprehensive, well-formatted project brief that summarizes all the requirements, features, timeline, and other details we've discussed. Format it professionally as if it's a document that could be submitted to a development team."
            }, {
              role: 'assistant',
              content: data.message
            }],
            timestamp: new Date().toISOString()
          }
        });
        console.log('Project brief notification sent successfully');
      } catch (notificationError) {
        console.error('Failed to send project brief notification:', notificationError);
        // Don't throw here - we don't want to break the user experience if notification fails
      }

      toast({
        title: "Brief Generated!",
        description: "Your project brief has been generated successfully.",
      });

    } catch (error) {
      console.error('Brief generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate brief. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const downloadBrief = () => {
    const briefContent = messages
      .filter(msg => msg.role === 'assistant')
      .pop()?.content || '';
    
    const element = document.createElement('a');
    const file = new Blob([briefContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'project-brief.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
    <Card className="glass-effect border-webdev-glass-border h-[600px] flex flex-col">
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
                    ? 'bg-webdev-darker-gray' 
                    : 'bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-webdev-silver" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-webdev-darker-gray text-webdev-silver'
                    : 'bg-webdev-darker-gray/50 text-webdev-soft-gray'
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
                <div className="bg-webdev-darker-gray/50 rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-webdev-soft-gray rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-webdev-soft-gray rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-webdev-soft-gray rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Actions */}
        {messages.length > 4 && (
          <div className="p-4 border-t border-webdev-glass-border">
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                onClick={generateBrief}
                disabled={isGeneratingBrief}
                className="glass-effect border border-webdev-glass-border text-webdev-silver hover:text-white transition-all duration-300"
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
                variant="outline"
                className="glass-effect border border-webdev-glass-border text-webdev-silver hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={restartBrief}
                variant="outline"
                className="glass-effect border border-webdev-glass-border text-webdev-silver hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-webdev-glass-border">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              className="flex-1 bg-webdev-darker-gray/50 border-webdev-glass-border text-webdev-silver placeholder-webdev-soft-gray focus:border-webdev-gradient-blue"
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