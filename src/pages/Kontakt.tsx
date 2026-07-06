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
        subtitle="Wir schauen gemeinsam, wo euer System am meisten Zeit spart — unverbindlich."
      />
      <Contact />
    </>
  );
}
