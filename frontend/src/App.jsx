import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Marketplace from "./pages/Marketplace";
import Mint from "./pages/Mint";
import Sell from "./pages/Sell";
import Header from "./pages/Header";




function App() {
  return (
    <BrowserRouter>

      <Header />
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/sell" element={<Sell />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;