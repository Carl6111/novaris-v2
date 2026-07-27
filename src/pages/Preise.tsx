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
        subtitle="Klicken Sie an, was Ihnen am meisten Zeit kostet. Den Preis dazu besprechen wir im Gespräch."
      />
      <Pricing />
      <Includes />
      <Faq />
      <Cta />
    </>
  );
}
