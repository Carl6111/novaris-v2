import { createContext, useContext } from "react";

/**
 * Getrennt von der Provider-Datei, weil Fast Refresh nur greift, wenn eine
 * Datei ausschliesslich Komponenten exportiert.
 */

export type AuthGateApi = {
  /** Angemeldet — oder es gibt gar keine Anmeldung. */
  allowed: boolean;
  /** Oeffnet das Fenster ohne an eine Aktion gebunden zu sein. */
  open: (reason: string) => void;
  /** `true` = Aktion darf laufen. `false` = Fenster ist auf, Aktion gestoppt. */
  requireAuth: (reason: string) => boolean;
};

/** Ohne eingerichtete Anmeldung blockiert nichts. */
export const OPEN_GATE: AuthGateApi = {
  allowed: true,
  open: () => {},
  requireAuth: () => true,
};

export const AuthGateContext = createContext<AuthGateApi>(OPEN_GATE);

export function useAuthGate() {
  return useContext(AuthGateContext);
}
