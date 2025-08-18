import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Client } from "@shared/schema";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [clientCount, setClientCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const q = query(collection(db, "clients"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Client[];
      
      setClients(clientsData);
      setClientCount(clientsData.length);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching clients:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    clients,
    clientCount,
    loading,
  };
}
