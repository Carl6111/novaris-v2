import Hero from "../components/home/Hero";
import DemoVideo from "../components/home/DemoVideo";
import Problems from "../components/home/Problems";
import Payoff from "../components/home/Payoff";
import Organism from "../components/home/Organism";
import Stats from "../components/home/Stats";
import Integrations from "../components/home/Integrations";
import Cta from "../components/home/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <DemoVideo />
      <Problems />
      <Payoff />
      <Organism />
      <Stats />
      <Integrations />
      <Cta />
    </>
  );
}
