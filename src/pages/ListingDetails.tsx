
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type Listing } from "../shared/ListingCard";
import { ArrowLeft, Heart } from "lucide-react";
import { useAuth } from "../components/AuthProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import  "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import LoginPromptModal from "../components/LoginPromptModal";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const all = localStorage.getItem("campusplug-listings");
    const parsed: Listing[] = all ? JSON.parse(all) : [];
    const match = parsed.find((item) => item.id === id);

    if (match) {
      setListing(match);

      const viewedKey = `viewed-${match.id}`;
      if (!sessionStorage.getItem(viewedKey) && match.isPremium) {
        const viewKey = `views-${match.id}`;
        const currentViews = parseInt(localStorage.getItem(viewKey) || "0");
        localStorage.setItem(viewKey, (currentViews + 1).toString());
        sessionStorage.setItem(viewedKey, "true");
      }

      const wishlist = JSON.parse(localStorage.getItem("campusplug-wishlist") || "[]");
      setIsSaved(wishlist.some((item: Listing) => item.id === match.id));
    } else {
      setNotFound(true);
    }
  }, [id]);

  const toggleWishlist = () => {
    if (!user) return setShowLoginModal(true);
    if (!listing) return;

    const wishlist = JSON.parse(localStorage.getItem("campusplug-wishlist") || "[]");
    const exists = wishlist.some((item: Listing) => item.id === listing.id);
    let updated;

    if (exists) {
      updated = wishlist.filter((item: Listing) => item.id !== listing.id);
    } else {
      updated = [listing, ...wishlist];
    }

    localStorage.setItem("campusplug-wishlist", JSON.stringify(updated));
    setIsSaved(!exists);
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-700 dark:text-white">
        <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
        <p className="text-sm text-gray-500">This listing doesn't exist or has been removed.</p>
        <Link
          to="/explore"
          className="mt-4 inline-block px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          🔍 Back to Explore
        </Link>
      </div>
    );
  }

  if (!listing) return null;

  const {
    title,
    price,
    description,
    imageUrl,
    imageUrls,
    location,
    category,
    condition,
    email,
    whatsapp,
    username,
    isVerified,
    isPremium,
    // rating,
    // reviewsCount,
  } = listing;

  const images = Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls : [imageUrl];
  const whatsappLink =
    whatsapp && `https://wa.me/234${whatsapp.replace(/^0/, "")}?text=Hi%20I'm%20interested%20in%20your%20listing%20on%20CampusPlug`;

  const handleWhatsappClick = () => {
    if (isPremium) {
      const clickKey = `clicks-${id}`;
      const current = parseInt(localStorage.getItem(clickKey) || "0");
      localStorage.setItem(clickKey, (current + 1).toString());
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Top nav */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold">Details</h2>
        </div>

        {/* Image Swiper */}
        <div className="w-full rounded-lg overflow-hidden">
          <Swiper
            spaceBetween={10}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            modules={[Pagination, Autoplay]}
            className="rounded-md"
          >
            {images.map((src, i) => (
              <SwiperSlide key={i}>
                <img
                  src={src}
                  alt={`Image ${i + 1}`}
                  className="w-full h-72 sm:h-96 object-cover cursor-pointer"
                  onClick={() => {
                    setPhotoIndex(i);
                    setLightboxOpen(true);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Lightbox Preview */}
        {lightboxOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => setLightboxOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + images.length - 1) % images.length)
            }
            onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
            imageTitle={`${title} (${photoIndex + 1} of ${images.length})`}
          />
        )}

        {/* Title & Price */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          <p className="text-xl text-blue-600 font-semibold dark:text-blue-400">
            ₦{Number(price).toLocaleString()}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>📍 {location}</span>
          <span>📂 {category}</span>
          <span>🛠 {condition}</span>
          {isVerified && <span className="text-green-600 font-medium">✔ Verified Seller</span>}
          {isPremium && <span className="text-yellow-500 font-medium">★ Premium</span>}
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {description}
        </p>

        {/* Seller Info */}
        <div className="border-t pt-4 text-sm space-y-1">
          <p>
            👤 Seller:{" "}
            {email ? (
              <Link to={`/seller/${email}`} className="text-blue-600 hover:underline">
                @{username || "Unknown"}
              </Link>
            ) : (
              <span className="text-gray-400 italic">N/A</span>
            )}
          </p>
          <p>📧 Email: {email || "N/A"}</p>
          {whatsappLink && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsappClick}
              className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              📞 Contact on WhatsApp
            </a>
          )}
        </div>

        {/* Ratings + Wishlist row */}
        <div className="flex justify-between items-center pt-6 border-t">
          {/* ⭐ Future Reviews */}
          {/* 
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            {Array.from({ length: Math.floor(rating || 0) }, (_, i) => (
              <span key={i}>★</span>
            ))}
            {rating && rating % 1 !== 0 && <span>☆</span>}
            <span className="text-gray-500 dark:text-gray-400 ml-1 text-xs">
              {rating?.toFixed(1)} ({reviewsCount} reviews)
            </span>
          </div>
          */}

          <div className="text-sm text-gray-400 italic">
            ⭐ Ratings and reviews coming soon
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleWishlist}
              className="flex items-center gap-1 text-pink-600 dark:text-pink-400 text-sm hover:underline"
            >
              <Heart size={16} fill={isSaved ? "#ec4899" : "none"} />
              {isSaved ? "Saved" : "Wishlist"}
            </button>

            <button
              disabled
              className="text-gray-500 text-sm cursor-not-allowed"
              title="Share coming soon"
            >
              ↗ Share
            </button>
          </div>
        </div>

        {/* 🔐 Login Modal */}
        <LoginPromptModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </div>
    </div>
  );
};

export default ListingDetails;
