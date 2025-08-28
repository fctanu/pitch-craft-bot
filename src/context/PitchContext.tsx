import React, { createContext, useContext, useState } from "react";
import { nanoid } from "nanoid";

export interface GeneratedPitch {
  id: string;
  oneLiner: string;
  structure: string[]; // each slide bullet / heading
  transcript: string;
  createdAt: string;
}

interface PitchContextValue {
  pitches: GeneratedPitch[];
  addPitch: (p: Omit<GeneratedPitch, "id" | "createdAt">) => GeneratedPitch;
  deletePitch: (id: string) => void;
  updatePitch: (
    id: string,
    data: Partial<Pick<GeneratedPitch, "oneLiner" | "structure" | "transcript">>
  ) => void;
}

const PitchContext = createContext<PitchContextValue | undefined>(undefined);

export const usePitches = () => {
  const ctx = useContext(PitchContext);
  if (!ctx) throw new Error("usePitches must be used within PitchProvider");
  return ctx;
};

export const PitchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pitches, setPitches] = useState<GeneratedPitch[]>([]);

  const addPitch: PitchContextValue["addPitch"] = (p) => {
    const newPitch: GeneratedPitch = {
      id: nanoid(),
      createdAt: new Date().toISOString(),
      ...p,
    };
    setPitches((prev) => [newPitch, ...prev]);
    return newPitch;
  };

  const deletePitch = (id: string) =>
    setPitches((p) => p.filter((x) => x.id !== id));

  const updatePitch: PitchContextValue["updatePitch"] = (id, data) => {
    setPitches((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  return (
    <PitchContext.Provider
      value={{ pitches, addPitch, deletePitch, updatePitch }}
    >
      {children}
    </PitchContext.Provider>
  );
};
