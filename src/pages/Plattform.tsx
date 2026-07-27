import PageHero from "../components/ui/PageHero";
import HorizonBackground from "../components/plattform/HorizonBackground";
import ModuleRows from "../components/plattform/ModuleRows";
import Statement from "../components/ui/Statement";
import Examples from "../components/plattform/Examples";
import Process from "../components/plattform/Process";
import Cta from "../components/home/Cta";

export default function Plattform() {
  return (
    <>
      <PageHero
        eyebrow="// Die Plattform"
        title={
          <>
            Ihr ganzer Betrieb. <span className="accent">Ein System.</span>
          </>
        }
        subtitle="Fünf Werkzeuge, die sonst getrennt laufen, hinter einem Login."
        background={<HorizonBackground />}
      />
      <ModuleRows />
      <Statement
        eyebrow="// Kein Tool-Chaos"
        subtitle="Keine Klick-Tools wie Make, Zapier oder n8n. Ihr System läuft auf eigenem Code, auf Ihrer Infrastruktur."
        underline
      >
        Gebaut, nicht <span className="accent">zusammengeklickt.</span>
      </Statement>
      <Examples />
      <Process />
      <Cta />
    </>
  );
}
