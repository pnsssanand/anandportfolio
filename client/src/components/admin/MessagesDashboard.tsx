import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMessages } from '@/hooks/useMessages';
import { 
  MessageSquare, 
  Mail, 
  Clock, 
  User, 
  Search,
  Filter,
  MailOpen,
  Reply,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Circle,
  MoreVertical
} from 'lucide-react';

export default function MessagesDashboard() {
  const { 
    messages, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAsReplied, 
    deleteMessage, 
    markAllAsRead 
  } = useMessages();
  
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const filteredMessages = messages.filter(message => {
    const matchesFilter = filter === 'all' || message.status === filter;
    const matchesSearch = searchTerm === '' || 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const selectedMessageData = selectedMessage 
    ? messages.find(m => m.id === selectedMessage) 
    : null;

  const handleSelectMessage = async (messageId: string) => {
    setSelectedMessage(messageId);
    const message = messages.find(m => m.id === messageId);
    if (message && message.status === 'new') {
      await markAsRead(messageId);
    }
  };

  const handleReply = () => {
    if (!selectedMessageData) return;
    
    const subject = `Re: ${selectedMessageData.subject}`;
    const body = `Hi ${selectedMessageData.name},\n\n${replyText}\n\nBest regards,\nAnand Pinisetty`;
    const mailtoLink = `mailto:${selectedMessageData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink, '_blank');
    markAsReplied(selectedMessageData.id);
    setReplyText('');
    setIsReplying(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500 text-white';
      case 'read': return 'bg-gray-500 text-white';
      case 'replied': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Circle className="w-4 h-4" />;
      case 'read': return <MailOpen className="w-4 h-4" />;
      case 'replied': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-effect border-gold/20 bg-transparent">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gold mb-2 flex items-center">
            <MessageSquare className="w-8 h-8 mr-3" />
            Messages Dashboard
          </h2>
          <p className="text-gray-400">
            Manage and respond to contact form submissions
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Quick Status */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="glass-effect border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-4 text-center">
            <div className="text-blue-400 mb-2">
              <MessageSquare className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-white">{messages.length}</p>
            <p className="text-gray-400 text-sm">Total Messages</p>
          </CardContent>
        </Card>
        
        <Card className="glass-effect border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-4 text-center">
            <div className="text-yellow-400 mb-2">
              <Circle className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-white">{unreadCount}</p>
            <p className="text-gray-400 text-sm">Unread</p>
          </CardContent>
        </Card>
        
        <Card className="glass-effect border-green-500/20 bg-green-500/5">
          <CardContent className="p-4 text-center">
            <div className="text-green-400 mb-2">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-white">
              {messages.filter(m => m.status === 'replied').length}
            </p>
            <p className="text-gray-400 text-sm">Replied</p>
          </CardContent>
        </Card>
        
        <Card className="glass-effect border-gray-500/20 bg-gray-500/5">
          <CardContent className="p-4 text-center">
            <div className="text-gray-400 mb-2">
              <Clock className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-white">
              {messages.filter(m => m.status === 'read').length}
            </p>
            <p className="text-gray-400 text-sm">Read</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-luxury-light border-gray-600 text-white focus:border-gold"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {(['all', 'new', 'read', 'replied'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(status)}
              className={filter === status ? "bg-gold text-black" : ""}
            >
              <Filter className="w-4 h-4 mr-1" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages Layout */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto">
          <AnimatePresence>
            {filteredMessages.length === 0 ? (
              <Card className="glass-effect border-gold/20 bg-transparent">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">No messages found</p>
                </CardContent>
              </Card>
            ) : (
              filteredMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`glass-effect border-gold/20 bg-transparent cursor-pointer transition-all ${
                      selectedMessage === message.id 
                        ? 'ring-2 ring-gold/50 border-gold/40' 
                        : 'hover:border-gold/30'
                    }`}
                    onClick={() => handleSelectMessage(message.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={`${getStatusColor(message.status)} text-xs px-2 py-1`}
                          >
                            {getStatusIcon(message.status)}
                            <span className="ml-1">{message.status}</span>
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(message.createdAt)}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-white text-sm mb-1 truncate">
                        {message.name}
                      </h4>
                      <p className="text-gray-400 text-xs mb-2 truncate">
                        {message.email}
                      </p>
                      <p className="text-gray-300 text-sm font-medium mb-1 truncate">
                        {message.subject}
                      </p>
                      <p className="text-gray-400 text-xs line-clamp-2">
                        {message.message}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3">
          {selectedMessageData ? (
            <Card className="glass-effect border-gold/20 bg-transparent">
              <CardHeader className="border-b border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-gold text-xl mb-2">
                      {selectedMessageData.subject}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{selectedMessageData.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{selectedMessageData.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{selectedMessageData.createdAt.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(selectedMessageData.status)}>
                    {getStatusIcon(selectedMessageData.status)}
                    <span className="ml-1">{selectedMessageData.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="bg-gray-800/30 rounded-lg p-4 mb-6">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedMessageData.message}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button
                    onClick={() => setIsReplying(!isReplying)}
                    className="bg-gradient-to-r from-gold to-gold-light text-black font-semibold"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                  
                  <Button
                    onClick={() => markAsReplied(selectedMessageData.id)}
                    variant="outline"
                    className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Replied
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this message?')) {
                        deleteMessage(selectedMessageData.id);
                        setSelectedMessage(null);
                      }
                    }}
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
                
                {/* Reply Form */}
                <AnimatePresence>
                  {isReplying && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-700 pt-6"
                    >
                      <h4 className="text-white font-medium mb-4">
                        Reply to {selectedMessageData.name}
                      </h4>
                      <Textarea
                        placeholder="Type your reply here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={4}
                        className="bg-luxury-light border-gray-600 text-white focus:border-gold mb-4"
                      />
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleReply}
                          disabled={!replyText.trim()}
                          className="bg-gradient-to-r from-gold to-gold-light text-black font-semibold"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Send Reply
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsReplying(false);
                            setReplyText('');
                          }}
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-effect border-gold/20 bg-transparent">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-300 mb-4">
                  Select a Message
                </h3>
                <p className="text-gray-400">
                  Choose a message from the list to view details and respond
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
