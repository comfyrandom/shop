import {HashRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import Header from "./components/navbar/Navbar.tsx";
import CatalogPage from "./pages/CatalogPage.tsx";

function App() {
  return (
    <HashRouter>
        <Header />
        <div className="main-content container mx-auto px-4 md:px-16 lg:px-20 lg:max-w-[1366px] mt-25 flex-1">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
            </Routes>
        </div>
    </HashRouter>
  )
}

export default App
