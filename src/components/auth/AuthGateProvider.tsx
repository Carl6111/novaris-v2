import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useUser } from "@clerk/react";
import AuthGate from "./AuthGate";
import { AuthGateContext, OPEN_GATE, type AuthGateApi } from "./authGateContext";
import { AUTH_READY } from "../../lib/auth";

/**
 * Die eine Stelle, an der entschieden wird, ob jemand weitermachen darf.
 *
 * Formulare fragen `requireAuth(grund)`. Kommt `false` zurueck, ist das
 * Fenster schon offen und die Aktion wurde nicht ausgefuehrt.
 *
 * Ohne Clerk-Key gibt es keine Anmeldung — dann ist alles erlaubt und nichts
 * blockiert. Ein vergessener Env-Var darf die Seite nicht unbenutzbar machen.
 */

function ClerkGate({ children }: { children: ReactNode }) {
  const { isSignedIn } = useUser();
  const [reason, setReason] = useState<string | null>(null);

  const allowed = isSignedIn === true;

  const open = useCallback((r: string) => setReason(r), []);

  const requireAuth = useCallback(
    (r: string) => {
      if (isSignedIn === true) return true;
      setReason(r);
      return false;
    },
    [isSignedIn],
  );

  const api = useMemo<AuthGateApi>(
    () => ({ allowed, open, requireAuth }),
    [allowed, open, requireAuth],
  );

  return (
    <AuthGateContext.Provider value={api}>
      {children}
      <AuthGate
        open={reason !== null}
        title={reason ?? ""}
        onGuest={() => setReason(null)}
      />
    </AuthGateContext.Provider>
  );
}

export default function AuthGateProvider({ children }: { children: ReactNode }) {
  // Die Hooks in ClerkGate brauchen den ClerkProvider aus main.tsx.
  if (!AUTH_READY) {
    return (
      <AuthGateContext.Provider value={OPEN_GATE}>
        {children}
      </AuthGateContext.Provider>
    );
  }
  return <ClerkGate>{children}</ClerkGate>;
}
