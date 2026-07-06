import PageHero from "../components/ui/PageHero";
import About from "../components/ueber/About";
import Statement from "../components/ui/Statement";
import Cta from "../components/home/Cta";

export default function Ueber() {
  return (
    <>
      <PageHero
        eyebrow="// Novaris"
        title={
          <>
            Mehr Output. <span className="accent">Gleiches Team.</span>
          </>
        }
        subtitle="Wir bringen ambitionierte Betriebe aufs nächste Level — mit KI-Agents, die echte Arbeit übernehmen."
      />
      <About />
      <Statement eyebrow="// Die Überzeugung">
        Technik soll arbeiten. <span className="accent">Nicht ihr.</span>
      </Statement>
      <Cta />
    </>
  );
}
