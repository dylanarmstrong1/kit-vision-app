import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

import { DEFAULT_MANIFEST } from "./manifest";
import { Manifest, VerificationReport } from "../types/kit";

type KitSessionValue = {
  selectedImageUri: string | null;
  manifest: Manifest | null;
  report: VerificationReport | null;
  errorMessage: string | null;
  activeManifest: Manifest;
  setSelectedImageUri: (imageUri: string | null) => void;
  setManifest: (manifest: Manifest | null) => void;
  setReport: (report: VerificationReport | null) => void;
  setErrorMessage: (message: string | null) => void;
  clearVerification: () => void;
  clearError: () => void;
  resetAll: () => void;
};

const KitSessionContext = createContext<KitSessionValue | null>(null);

export function KitSessionProvider({ children }: PropsWithChildren) {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const value: KitSessionValue = {
    selectedImageUri,
    manifest,
    report,
    errorMessage,
    activeManifest: manifest ?? DEFAULT_MANIFEST,
    setSelectedImageUri,
    setManifest,
    setReport,
    setErrorMessage,
    clearVerification: () => {
      setReport(null);
    },
    clearError: () => {
      setErrorMessage(null);
    },
    resetAll: () => {
      setSelectedImageUri(null);
      setReport(null);
      setErrorMessage(null);
    },
  };

  return (
    <KitSessionContext.Provider value={value}>
      {children}
    </KitSessionContext.Provider>
  );
}

export function useKitSession() {
  const context = useContext(KitSessionContext);

  if (!context) {
    throw new Error("useKitSession must be used within a KitSessionProvider.");
  }

  return context;
}
