import {HashRouter, Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import Header from "./components/navbar/Navbar.tsx";
import CatalogPage from "./pages/CatalogPage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import BlogPage from "./pages/BlogPage.tsx";
import BlogPostPage from "./pages/BlogPostPage.tsx";
import {ToastContainer} from "react-toastify";
import EditProductPage from "./pages/EditProductPage.tsx";
import CreateProductPage from "./pages/CreateProductPage.tsx";
import {AuthProvider} from "./contexts/AuthProvider.tsx";
import BlogPostCreatePage from "./pages/BlogPostCreatePage.tsx";
import BlogPostEditPage from "./pages/BlogPostEditPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import PurchaseConfirmation from "./pages/PurchaseConfirmation.tsx";
import EditProfilePage from "./pages/EditProfilePage.tsx";
import InviteCodePage from "./pages/InviteCodePage.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import {useEffect, useState} from "react";
import {isAuthenticated} from "./services/auth.service.ts";
import LoginPage from "./pages/LoginPage.tsx";
import GitHubPages404 from "./pages/GitHubPages404.tsx";

function App() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            const auth = await isAuthenticated();
            setIsAuth(auth);
        }

        checkAuth();
    }, [])

    if (!isAuth) {
        return (
            <HashRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="*" element={ <GitHubPages404 /> } />
                        <Route path="/register" element={ <RegisterPage />} />
                        <Route path="/login" element={ <LoginPage /> } />
                    </Routes>
                </AuthProvider>
            </HashRouter>
        )
    }

    return (
        <HashRouter>
            <AuthProvider>
                <Routes>
                    {/* Route for ChatPage without Header and main-content */}
                    <Route path="/messages/:userAlias" element={<ChatPage />} />
                    <Route path="/messages" element={<ChatPage />} />

                    {/* All other routes with Header and main-content */}
                    <Route path="*" element={
                        <>
                            <Header />
                            <div className="main-content container mx-auto px-4 md:px-16 lg:px-20 max-w-[1280px] max-lg:m-0 max-lg:mt-25 mt-25 flex-1 mb-10">
                                <Routes>
                                    <Route path="/" element={<BlogPage />} />
                                    <Route path="/about" element={<HomePage />} />
                                    <Route path="/catalog" element={<CatalogPage />} />
                                    <Route path="/product/:productAlias" element={<ProductPage />} />
                                    <Route path="/editProduct/:productAlias" element={<EditProductPage />} />
                                    <Route path="/createProduct" element={<CreateProductPage />} />
                                    <Route path="/user/:alias" element={<ProfilePage />} />
                                    <Route path="/blog/:postId" element={<BlogPostPage />} />
                                    <Route path="/blog/create" element={<BlogPostCreatePage />} />
                                    <Route path="/blog/edit/:postId" element={<BlogPostEditPage />} />
                                    <Route path="/blog" element={<BlogPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/confirm-purchase/:productAlias" element={<PurchaseConfirmation />} />
                                    <Route path="/editProfile/:alias" element={<EditProfilePage />} />
                                    <Route path="/invites" element={<InviteCodePage />} />
                                </Routes>
                            </div>
                        </>
                    } />
                </Routes>
                <ToastContainer />
            </AuthProvider>
        </HashRouter>
    )
}

export default App