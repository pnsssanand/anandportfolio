import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  orderBy, 
  query, 
  updateDoc, 
  deleteDoc,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Set up real-time listener for messages
    const messagesQuery = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData: Message[] = [];
      let newCount = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const message: Message = {
          id: doc.id,
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          status: data.status || 'new',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
        
        messagesData.push(message);
        
        if (message.status === 'new') {
          newCount++;
        }
      });

      setMessages(messagesData);
      setUnreadCount(newCount);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching messages:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load messages'
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const markAsRead = async (messageId: string) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        status: 'read',
        updatedAt: new Date()
      });
      
      toast({
        title: 'Success',
        description: 'Message marked as read'
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update message status'
      });
    }
  };

  const markAsReplied = async (messageId: string) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        status: 'replied',
        updatedAt: new Date()
      });
      
      toast({
        title: 'Success',
        description: 'Message marked as replied'
      });
    } catch (error) {
      console.error('Error marking message as replied:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update message status'
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await deleteDoc(doc(db, 'messages', messageId));
      
      toast({
        title: 'Success',
        description: 'Message deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete message'
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadQuery = query(
        collection(db, 'messages'),
        where('status', '==', 'new')
      );
      
      const unreadMessages = await getDocs(unreadQuery);
      const updatePromises = unreadMessages.docs.map(doc => 
        updateDoc(doc.ref, {
          status: 'read',
          updatedAt: new Date()
        })
      );
      
      await Promise.all(updatePromises);
      
      toast({
        title: 'Success',
        description: 'All messages marked as read'
      });
    } catch (error) {
      console.error('Error marking all messages as read:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update messages'
      });
    }
  };

  const getRecentMessages = (limit: number = 5) => {
    return messages.slice(0, limit);
  };

  const getMessagesByStatus = (status: 'new' | 'read' | 'replied') => {
    return messages.filter(message => message.status === status);
  };

  return {
    messages,
    loading,
    unreadCount,
    markAsRead,
    markAsReplied,
    deleteMessage,
    markAllAsRead,
    getRecentMessages,
    getMessagesByStatus
  };
}
