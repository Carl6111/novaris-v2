import PageHero from "../components/ui/PageHero";
import Pricing from "../components/preise/Pricing";
import Includes from "../components/preise/Includes";
import Faq from "../components/preise/Faq";
import Cta from "../components/home/Cta";

export default function Preise() {
  return (
    <>
      <PageHero
        eyebrow="// Pakete"
        title={
          <>
            Klein anfangen. <span className="accent">Groß wachsen.</span>
          </>
        }
        subtitle="Klickt an, was euch am meisten Zeit kostet. Den Richtwert dazu seht ihr sofort."
      />
      <Pricing />
      <Includes />
      <Faq />
      <Cta />
    </>
  );
}
