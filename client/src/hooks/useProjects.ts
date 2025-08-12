import { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project, InsertProject } from "@shared/schema";
import { useToast } from "./use-toast";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Project[];
      
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch projects",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (projectData: InsertProject) => {
    try {
      const docRef = await addDoc(collection(db, "projects"), {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      await fetchProjects(); // Refresh the list
      
      toast({
        title: "Success",
        description: "Project added successfully",
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Error adding project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add project",
      });
      throw error;
    }
  };

  const updateProject = async (id: string, projectData: Partial<InsertProject>) => {
    try {
      const docRef = doc(db, "projects", id);
      await updateDoc(docRef, {
        ...projectData,
        updatedAt: serverTimestamp(),
      });
      
      await fetchProjects(); // Refresh the list
      
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update project",
      });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const docRef = doc(db, "projects", id);
      await deleteDoc(docRef);
      
      await fetchProjects(); // Refresh the list
      
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects,
  };
}
