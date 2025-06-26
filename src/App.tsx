import {HashRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import Header from "./components/navbar/Navbar.tsx";
import CatalogPage from "./pages/CatalogPage.tsx";
import ProductPage from "./pages/ProductPage.tsx";

function App() {
  return (
    <HashRouter>
        <Header />
        <div className="main-content container mx-auto px-4 md:px-16 lg:px-20 max-w-[1280px] max-lg:m-5 mt-25 flex-1">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:productId" element={<ProductPage />} />
            </Routes>
        </div>
    </HashRouter>
  )
}

export default App
