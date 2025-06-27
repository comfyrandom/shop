import {HashRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import Header from "./components/navbar/Navbar.tsx";
import CatalogPage from "./pages/CatalogPage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import BlogPostPage from "./pages/BlogPostPage.tsx";

function App() {
  return (
    <HashRouter>
        <Header />
        <div className="main-content container mx-auto px-4 md:px-16 lg:px-20 max-w-[1280px] max-lg:m-0 max-lg:mt-25 mt-25 flex-1 mb-10">
            <Routes>
                <Route path="/" element={<BlogPage />} />
                <Route path="/about" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route path="/user/:userId" element={<ProfilePage />} />
                <Route path="/blog/:postId" element={<BlogPostPage />} />
                <Route path="/blog" element={<BlogPage />} />
            </Routes>
        </div>
    </HashRouter>
  )
}

export default App
