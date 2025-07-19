import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { type Listing } from "../shared/ListingCard";
import { useAuth } from "../components/AuthProvider";
import toast from "react-hot-toast";
import PremiumPromoCard from "../components/PremiumPromoCard";
import { shouldShowPremiumPrompt, updatePremiumPromptDate } from "../utils/premiumPrompt";

const Dashboard = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    const all = localStorage.getItem("campusplug-listings");
    const parsed: Listing[] = all ? JSON.parse(all) : [];
    const filtered = parsed.filter((item) => item.email === user?.email);
    setMyListings(filtered);
  }, [user]);

  useEffect(() => {
    const hasShown = localStorage.getItem("campusplug-verified-toast");
    if (user?.isVerified && !hasShown) {
      toast.success("You are now a verified seller! 🎉");
      localStorage.setItem("campusplug-verified-toast", "true");
    }
  }, [user]);

  useEffect(() => {
    if (user?.isVerified) {
      const lastShown = localStorage.getItem("campusplug-verified-banner-time");
      if (!lastShown) {
        const now = new Date().getTime();
        localStorage.setItem("campusplug-verified-banner-time", now.toString());
      }
    }
  }, [user]);

  
  const showVerifiedBanner = (() => {
    if (!user?.isVerified) return false;
    const storedTime = localStorage.getItem("campusplug-verified-banner-time");
    if (!storedTime) return false;
    const timePassed = Date.now() - parseInt(storedTime);
    return timePassed < 60 * 60 * 1000; 
  })();

  useEffect(() => {
    if (user?.isVerified && !user?.isPremiumSeller && shouldShowPremiumPrompt()) {
      setShowPromo(true);
      updatePremiumPromptDate();
    }
  }, [user]);

  const handleDelete = (id: string) => {
    const all = localStorage.getItem("campusplug-listings");
    const parsed: Listing[] = all ? JSON.parse(all) : [];
    const updated = parsed.filter((item) => item.id !== id);
    localStorage.setItem("campusplug-listings", JSON.stringify(updated));
    setMyListings((prev) => prev.filter((item) => item.id !== id));
  };

  const isExpired = (createdAt: number, isPremium?: boolean) => {
    const now = Date.now();
    const maxAge = (isPremium ? 45 : 30) * 24 * 60 * 60 * 1000;
    return now - createdAt > maxAge;
  };

  const daysRemaining = (createdAt: number, isPremium?: boolean) => {
    const maxAge = (isPremium ? 45 : 30) * 24 * 60 * 60 * 1000;
    const expiry = createdAt + maxAge;
    const diff = Math.max(expiry - Date.now(), 0);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getSafeViews = (id: string) => {
    const sessionKey = `viewed-${id}`;
    if (!sessionStorage.getItem(sessionKey)) {
      const viewsKey = `views-${id}`;
      const current = parseInt(localStorage.getItem(viewsKey) || "0", 10);
      localStorage.setItem(viewsKey, (current + 1).toString());
      sessionStorage.setItem(sessionKey, "true");
    }
    return parseInt(localStorage.getItem(`views-${id}`) || "0", 10);
  };

  const total = myListings.length;
  const premiumCount = myListings.filter((item) => item.isPremium).length;

  const sortedAndFiltered = myListings
    .filter((item) => {
      const expired = isExpired(Number(item.id), item.isPremium);
      if (statusFilter === "active") return !expired;
      if (statusFilter === "expired") return expired;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "newest") return Number(b.id) - Number(a.id);
      if (sortOption === "oldest") return Number(a.id) - Number(b.id);
      if (sortOption === "premium") return Number(b.isPremium) - Number(a.isPremium);
      if (sortOption === "az") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="min-h-screen px-4 py-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-white mb-4">
      {showVerifiedBanner && (
        <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-400 dark:border-green-600 p-4 rounded-lg mb-6 text-sm">
          🎉 You’re verified and ready to sell! Click "Add New Listing" to get started.
        </div>
      )}

      {showPromo && <PremiumPromoCard />}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          {user?.email && (
            <Link
              to={`/seller/${user.email}`}
              className="text-sm text-blue-600 hover:underline block mt-1"
            >
              🔗 View My Seller Profile
            </Link>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full md:w-auto justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-0">
            <span className="mr-4">Total Listings: {total}</span>
            <span>Premium: {premiumCount}</span>
          </div>

          {!user?.isPremiumSeller && user?.isVerified && (
            <Link
              to="/premium"
              className="py-2 md:py-1.5 px-4 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-md shadow-sm transition text-center"
            >
              🌟 Go Premium
            </Link>
          )}

          <Link
            to="/add"
            className="py-2 md:py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md shadow-sm transition text-center"
          >
            Add New Listing
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <label>Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="premium">Premium First</option>
            <option value="az">Title A–Z</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-2 py-1 dark:bg-gray-800 dark:border-gray-600"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {sortedAndFiltered.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          No listings match your selected filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {sortedAndFiltered.map((item) => {
            const expired = isExpired(Number(item.id), item.isPremium);
            const remaining = daysRemaining(Number(item.id), item.isPremium);
            const views = item.isPremium ? getSafeViews(item.id) : 0;
            const clicks = item.isPremium ? parseInt(localStorage.getItem(`clicks-${item.id}`) || "0") : 0;

            const imageList = Array.isArray(item.imageUrls) ? item.imageUrls : [item.imageUrl];

            return (
              <div
                key={item.id}
                className={`relative border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm ${expired ? "opacity-50" : ""}`}
              >
                <div className="relative w-full h-40 mb-3">
                  <img
                    src={imageList[0] || "/placeholder.png"}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  {imageList.length > 1 && (
                    <span className="absolute top-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                      +{imageList.length - 1} more
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-1">₦{item.price.toLocaleString()}</p>
                <p className="text-sm text-gray-400 mb-1">{item.category} • {item.location}</p>
                <p className="text-xs text-gray-400 italic mb-2">
                  {expired ? "Expired" : `⏳ ${remaining} day(s) left`}
                </p>

                {/* Premium stats */}
                {item.isPremium && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 space-y-1">
                    <p>👀 Views: <strong>{views}</strong></p>
                    <p>📞 WhatsApp Clicks: <strong>{clicks}</strong></p>
                  </div>
                )}

                <div className="flex gap-2 justify-between items-center">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                  <Link
                    to={`/edit/${item.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </Link>
                </div>

                {item.isPremium && (
                  <span className="absolute top-2 right-2 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                    Premium
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
