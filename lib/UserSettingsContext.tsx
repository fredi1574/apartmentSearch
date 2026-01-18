"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface UserSettingsContextType {
  workLocation: Location | null;
  setWorkLocation: (loc: Location | null) => void;
  workAddress: string;
  setWorkAddress: (address: string) => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [workLocation, setWorkLocationState] = useState<Location | null>(null);
  const [workAddress, setWorkAddressState] = useState<string>("");

  // Load from localStorage on mount
  useEffect(() => {
    const savedLoc = localStorage.getItem("workLocation");
    const savedAddr = localStorage.getItem("workAddress");
    if (savedLoc) setWorkLocationState(JSON.parse(savedLoc));
    if (savedAddr) setWorkAddressState(savedAddr);
  }, []);

  const setWorkLocation = (loc: Location | null) => {
    setWorkLocationState(loc);
    if (loc) {
      localStorage.setItem("workLocation", JSON.stringify(loc));
    } else {
      localStorage.removeItem("workLocation");
    }
  };

  const setWorkAddress = (addr: string) => {
    setWorkAddressState(addr);
    localStorage.setItem("workAddress", addr);
  };

  return (
    <UserSettingsContext.Provider value={{ workLocation, setWorkLocation, workAddress, setWorkAddress }}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider");
  }
  return context;
}
