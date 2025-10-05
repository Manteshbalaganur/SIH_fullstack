import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '../types';

interface AppContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('circularmetals-projects');
    if (stored) {
      const parsed = JSON.parse(stored);
      setProjects(parsed.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      })));
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('circularmetals-projects', JSON.stringify(projects));
    }
  }, [projects]);

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const getProject = (id: string) => {
    return projects.find(p => p.id === id);
  };

  return (
    <AppContext.Provider value={{ projects, addProject, updateProject, deleteProject, getProject }}>
      {children}
    </AppContext.Provider>
  );
};
