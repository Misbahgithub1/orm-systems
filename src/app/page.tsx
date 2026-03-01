
import Hero from "./components/hero/Hero";
import PortfolioSection, {
  type PortfolioItem,
} from "./components/Portfolio/Portfolio";
import FeaturesSection from "./components/sections/FeaturesSection";

import portfolio1 from "../../public/images/portfolio1.png";
import portfolio2 from "../../public/images/portfolio2.png";
import portfolio3 from "../../public/images/portfolio3.png";
import portfolio4 from "../../public/images/portfolio4.png";
import portfolio5 from "../../public/images/portfolio5.png";
import portfolio6 from "../../public/images/portfolio6.png";
import portfolio7 from "../../public/images/portfolio7.png";


const portfolioItems: PortfolioItem[] = [
  { src: portfolio1, alt: "Developer presenting at a meetup", layout: "tall" },
  { src: portfolio2, alt: "Engineer working with server racks", layout: "wide" },
  { src: portfolio3, alt: "Team collaborating in an office", layout: "wide" },
  { src: portfolio4, alt: "Developer focused on writing code" },
  { src: portfolio5, alt: "Technicians managing data center hardware", layout: "square" },
  { src: portfolio6, alt: "Colleagues reviewing a project on laptop", layout: "square" },
  { src: portfolio7, alt: "Team working together on devices", layout: "square" },
];

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <PortfolioSection items={portfolioItems} />
     
    </>
  );
}
