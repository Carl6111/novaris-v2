import Hero from "../components/home/Hero";
import Problems from "../components/home/Problems";
import Payoff from "../components/home/Payoff";
import SaveCalculator from "../components/home/SaveCalculator";
import Packages from "../components/home/Packages";
import Stats from "../components/home/Stats";
import Compare from "../components/home/Compare";
import Pilot from "../components/home/Pilot";
import NotForYou from "../components/home/NotForYou";
import Integrations from "../components/home/Integrations";
import Cta from "../components/home/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Problems />
      <Payoff />
      <SaveCalculator />
      {/* Beweis und Kostenanker stehen vor dem Preis: "Die Rechnung" setzt die
          Vollzeitkraft (3.500-4.500 EUR/Monat) als Vergleichsgroesse, erst danach
          nennen die Pakete eine Zahl. Umgekehrt trifft der Preis ungeankert. */}
      <Stats />
      <Compare />
      <Packages />
      <Pilot />
      <NotForYou />
      <Integrations />
      <Cta />
    </>
  );
}
