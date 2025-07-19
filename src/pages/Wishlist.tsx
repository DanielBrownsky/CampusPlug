
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import type { Listing } from "../shared/ListingCard";
import ListingCard from "../shared/ListingCard";
import { Link } from "react-router-dom";
import LoginPromptModal from "../components/LoginPromptModal";
import toast from "react-hot-toast";

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Listing[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setShowLoginPrompt(true);
      return;
    }

    const raw = localStorage.getItem("campusplug-wishlist");
    const parsed: Listing[] = raw ? JSON.parse(raw) : [];
    setWishlist(parsed);
    
    // 🔁 Later, replace with backend fetch:
    // fetchFromFirestoreWishlist(user.uid).then(setWishlist);
  }, [user]);

  const handleRemove = (id: string) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("campusplug-wishlist", JSON.stringify(updated));
    toast.success("Removed from wishlist 💔");
  };

  if (!user?.email) {
    return (
      <LoginPromptModal
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
      />
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-gray-400">Your wishlist is empty.</p>
          <Link
            to="/explore"
            className="mt-4 inline-block px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            🔍 Explore Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="relative">
              <ListingCard data={item} showPremiumBadge />
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 left-2 bg-white/80 hover:bg-white text-red-600 text-xs px-2 py-0.5 rounded shadow-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
