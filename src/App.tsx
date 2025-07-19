
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import AddListing from "./pages/AddListing";
import ListingDetails from "./pages/ListingDetails";
import SellerProfile from "./pages/SellerProfile";
import Premium from "./pages/Premium";
import VerifyMe from "./pages/VerifyMe";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
// import Register from "./pages/Register";
// import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import ToggleTheme from "./ToggleTheme";
import Explore from "./pages/Explore";
import { AuthProvider } from "./components/AuthProvider";
import { Toaster } from "react-hot-toast";
import Payment from "./pages/Payment";
import EditListing from "./pages/EditListing";
import Wishlist from "./pages/Wishlist";
import BottomNav from "./components/BottomNav";
import DesktopNav from "./components/DesktopNav";




const App = () => {
  

  return (
    <AuthProvider>
      <BrowserRouter>
      <DesktopNav />
      <Toaster position="top-center" toastOptions={{ duration:3000}} />
      <ToggleTheme />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/add" element={<AddListing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/seller/:id" element={<SellerProfile />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/verify" element={<VerifyMe />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit/:id" element={<EditListing />} />
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
        <Route path="/payment" element={<Payment />} />
      </Routes>
      <BottomNav />
      
    </BrowserRouter>
     </AuthProvider>
    );
};

export default App;
