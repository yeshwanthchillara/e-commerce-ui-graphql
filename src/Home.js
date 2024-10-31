import { useSelector } from "react-redux";
import DealsCarousel from "./Components/HomePage/DealsCarousel";
import ProductCard from "./Components/HomePage/ProductCard";

function Home() {

  return (
    <div style={{minHeight: '87.5vh'}}>
      <DealsCarousel />
      <ProductCard />
    </div>
  );
}

export default Home;
