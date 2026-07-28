import PageHero from "../components/ui/PageHero";
import About from "../components/ueber/About";
import Statement from "../components/ui/Statement";
import Cta from "../components/home/Cta";

export default function Ueber() {
  return (
    <>
      <PageHero
        eyebrow="// Lunakris"
        title={
          <>
            Mehr Output. <span className="accent">Gleiches Team.</span>
          </>
        }
        subtitle="Wir bauen KI-Systeme für Betriebe, die wachsen wollen, ohne jedes Mal jemanden einstellen zu müssen."
      />
      <About />
      <Statement eyebrow="// Die Überzeugung">
        Technik soll arbeiten. <span className="accent">Nicht Sie.</span>
      </Statement>
      <Cta />
    </>
  );
}
