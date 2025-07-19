
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { type Listing } from "../shared/ListingCard";
import ListingCard from "../shared/ListingCard";

interface SellerInfo {
  username: string;
  whatsapp: string;
  location: string;
}

const SellerProfile = () => {
  const { id } = useParams<{ id: string }>(); // Seller email or unique ID
  const [listings, setListings] = useState<Listing[]>([]);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("campusplug-listings");
    const allListings: Listing[] = stored ? JSON.parse(stored) : [];
    const sellerListings = allListings.filter((item) => item.email === id);
    setListings(sellerListings);

    if (sellerListings.length > 0) {
      const { username, whatsapp, location } = sellerListings[0];
      setSellerInfo({
        username: username ?? "",
        whatsapp: whatsapp ?? "",
        location: location ?? "",
      });
    }
  }, [id]);

  const isVerified = listings.some((l) => l.isPremium);

  return (
    <div className="min-h-screen px-4 py-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {sellerInfo ? (
        <>
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                @{sellerInfo.username}
                {isVerified && (
                  <span className="text-yellow-500 text-sm font-medium">✔ Verified</span>
                )}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                📍 Campus: {sellerInfo.location}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                🎯 Listings: {listings.length}
              </p>
            </div>

            <a
              href={`https://wa.me/234${sellerInfo.whatsapp.replace(/^0/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition text-sm"
            >
              💬 Chat on WhatsApp
            </a>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {listings.map((item) => (
                <ListingCard key={item.id} data={item} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">
              This seller hasn’t listed anything yet.
            </p>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-400 italic">Loading seller profile...</p>
      )}
    </div>
  );
};

export default SellerProfile;
