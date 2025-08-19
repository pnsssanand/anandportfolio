import { useState, useEffect, useCallback, useRef } from "react";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  onSnapshot,
  Unsubscribe
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project } from "@shared/schema";

interface UseProjectsOptions {
  enableLiveUpdates?: boolean;
  useCache?: boolean;
  cacheKey?: string;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: any;
  retry: () => void;
}

const CACHE_KEY = 'projectsCache:v1';
const CACHE_EXPIRY = 'projectsCacheExpiry:v1';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function useProjectsOptimized(options: UseProjectsOptions = {}): UseProjectsReturn {
  const {
    enableLiveUpdates = false,
    useCache = true,
    cacheKey = CACHE_KEY
  } = options;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const fetchedRef = useRef(false);
  const mountedRef = useRef(true);

  // Cache management
  const getCachedProjects = useCallback((): Project[] | null => {
    if (!useCache || typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      const expiry = localStorage.getItem(CACHE_EXPIRY);
      
      if (cached && expiry) {
        const expiryTime = parseInt(expiry, 10);
        if (Date.now() < expiryTime) {
          return JSON.parse(cached);
        }
      }
    } catch (error) {
      console.warn('Failed to read projects cache:', error);
    }
    
    return null;
  }, [useCache, cacheKey]);

  const setCachedProjects = useCallback((projectsData: Project[]) => {
    if (!useCache || typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(projectsData));
      localStorage.setItem(CACHE_EXPIRY, (Date.now() + CACHE_DURATION).toString());
    } catch (error) {
      console.warn('Failed to cache projects:', error);
    }
  }, [useCache, cacheKey]);

  // Process Firestore data
  const processProjectsData = useCallback((querySnapshot: any): Project[] => {
    return querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Project[];
  }, []);

  // Fetch projects with robust error handling
  const fetchProjects = useCallback(async () => {
    if (fetchedRef.current) return;
    
    try {
      setError(null);
      
      // Load from cache immediately on mobile
      if (useCache && !projects.length) {
        const cached = getCachedProjects();
        if (cached && cached.length > 0) {
          setProjects(cached);
          setLoading(false);
          console.log('Loaded projects from cache:', cached.length);
        }
      }

      const q = query(
        collection(db, "projects"),
        orderBy("createdAt", "desc"),
        limit(50)
      );

      if (enableLiveUpdates) {
        // Use real-time listener if explicitly enabled
        const unsubscribe = onSnapshot(q, 
          (querySnapshot) => {
            if (!mountedRef.current) return;
            
            const projectsData = processProjectsData(querySnapshot);
            setProjects(projectsData);
            setLoading(false);
            setCachedProjects(projectsData);
            fetchedRef.current = true;
            
            console.log('Fetched projects (live):', projectsData.length);
          },
          (error) => {
            if (!mountedRef.current) return;
            
            console.error("Error fetching projects (live):", error);
            
            // Handle quota exceeded error gracefully
            if (error.code === 'resource-exhausted') {
              console.warn('Firestore quota exceeded. Consider reducing reads or upgrading plan.');
            }
            
            setError(error);
            setLoading(false);
          }
        );
        
        unsubscribeRef.current = unsubscribe;
      } else {
        // Use one-time fetch by default (quota-friendly)
        const querySnapshot = await getDocs(q);
        
        if (!mountedRef.current) return;
        
        const projectsData = processProjectsData(querySnapshot);
        setProjects(projectsData);
        setLoading(false);
        setCachedProjects(projectsData);
        fetchedRef.current = true;
        
        console.log('Fetched projects (one-time):', projectsData.length);
      }
    } catch (error: any) {
      if (!mountedRef.current) return;
      
      console.error("Error fetching projects:", error);
      
      // Handle quota exceeded error
      if (error.code === 'resource-exhausted') {
        console.warn('Firestore quota exceeded. Consider reducing reads or upgrading plan.');
      }
      
      setError(error);
      setLoading(false);
    }
  }, [enableLiveUpdates, processProjectsData, getCachedProjects, setCachedProjects, useCache, projects.length]);

  // Retry function
  const retry = useCallback(() => {
    fetchedRef.current = false;
    setLoading(true);
    setError(null);
    fetchProjects();
  }, [fetchProjects]);

  // Fetch on mount
  useEffect(() => {
    mountedRef.current = true;
    
    // Debounce to prevent double fetch
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        fetchProjects();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      mountedRef.current = false;
      
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    retry,
  };
}
