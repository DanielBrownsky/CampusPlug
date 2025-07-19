import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExploreFilterBar from "../components/ExploreFilterBar";
import ShimmerCard from "../shared/ShimmerCard";
import { type Listing } from "../shared/ListingCard";

const Explore = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [campus, setCampus] = useState("All");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    const fetchListings = () => {
      const stored = localStorage.getItem("campusplug-listings");
      const parsed: Listing[] = stored ? JSON.parse(stored) : [];

      const now = Date.now();
      const filteredByExpiration = parsed.filter((item) => {
        const created = item.createdAt ? new Date(item.createdAt).getTime() : 0;
        const duration = item.isPremium ? 45 : 30;
        const expiresAt = created + duration * 24 * 60 * 60 * 1000;
        return !created || now <= expiresAt;
      });

      // 🔥 Premium first, then by date
      const sorted = filteredByExpiration.sort((a, b) => {
        if (a.isPremium && !b.isPremium) return -1;
        if (!a.isPremium && b.isPremium) return 1;
        return Number(b.createdAt) - Number(a.createdAt);
      });

      setListings(sorted);
      setLoading(false);
    };
    fetchListings();
  }, []);

  const filtered = listings.filter((item) => {
    const matchCampus = campus === "All" || item.location === campus;
    const matchCategory = category === "All" || item.category === category;
    return matchCampus && matchCategory;
  });

  const visibleListings = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen px-4 py-8 bg-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4">Explore Listings</h1>

      <ExploreFilterBar
        selectedCampus={campus}
        selectedCategory={category}
        onCampusChange={setCampus}
        onCategoryChange={setCategory}
        onReset={() => {
          setCampus("All");
          setCategory("All");
          setVisibleCount(9);
        }}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <ShimmerCard key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {visibleListings.map((item) => {
              const images = Array.isArray(item.imageUrls)
                ? item.imageUrls
                : item.imageUrl
                ? [item.imageUrl]
                : [];

              return (
                <Link
                  to={`/listing/${item.id}`}
                  key={item.id}
                  className="block hover:scale-[1.02] transition-transform relative group"
                >
                  <div className="relative w-full h-40 mb-2">
                    <img
                      src={images[0] || "/placeholder.png"}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    {images.length > 1 && (
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                        +{images.length - 1} more
                      </span>
                    )}
                    {item.isPremium && (
                      <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full">
                         Premium
                      </span>
                    )}
                  </div>
                  <div className="px-1">
                    <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      ₦{item.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.category} • {item.location}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-400 italic">No listings match the selected filters.</p>
      )}
    </div>
  );
};

export default Explore;
