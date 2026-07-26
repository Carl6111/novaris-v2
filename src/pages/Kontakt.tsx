import PageHero from "../components/ui/PageHero";
import Contact from "../components/kontakt/Contact";

export default function Kontakt() {
  return (
    <>
      <PageHero
        eyebrow="// 15 Minuten"
        title={
          <>
            Lass uns <span className="accent">reden.</span>
          </>
        }
        subtitle="Sechs Fragen, dann bekommt ihr einen Termin-Link. Kein Vertrieb dazwischen."
      />
      <Contact />
    </>
  );
}
