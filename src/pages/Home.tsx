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
      <Packages />
      <Stats />
      <Compare />
      <Pilot />
      <NotForYou />
      <Integrations />
      <Cta />
    </>
  );
}
