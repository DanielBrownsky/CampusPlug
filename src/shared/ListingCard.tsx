
import type { FC } from "react";

export type Listing = {
  showPremiumBadge?: boolean;
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  imageUrls?: string[]; 
  category: string;
  location: string;
  isPremium?: boolean;
  isVerified?: boolean;
  email?: string;
  description?: string;
  condition?: "New" | "Fairly Used" | "Used";
  username?: string;
  whatsapp?: string;
  createdAt?: number;
};

type Props = {
  data: Listing;
  showPremiumBadge?: boolean;
};

const ListingCard: FC<Props> = ({ data, showPremiumBadge }) => {
  const imageList = Array.isArray(data.imageUrls) && data.imageUrls.length > 0
    ? data.imageUrls
    : [data.imageUrl];

  return (
    <div className="relative rounded-xl overflow-hidden border dark:border-gray-700 shadow hover:shadow-lg transition group">
      <div className="relative w-full h-40">
        <img
          src={imageList[0]}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        {imageList.length > 1 && (
          <span className="absolute top-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full group-hover:bg-black/80">
            +{imageList.length - 1} more
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-1">
          {data.title}
        </h3>

        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">
          ₦{data.price.toLocaleString()}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{data.location}</span>
          <span>{data.category}</span>
        </div>
      </div>

      {/* PREMIUM + VERIFIED Badges */}
      {showPremiumBadge && data.isPremium && (
        <span className="absolute top-2 right-2 bg-yellow-400 text-xs text-black px-2 py-0.5 rounded">
          Premium
        </span>
      )}

      {!showPremiumBadge && data.isVerified && (
        <span className="absolute top-2 right-2 bg-green-600 text-xs text-white px-2 py-0.5 rounded">
          Verified
        </span>
      )}
    </div>
  );
};

export default ListingCard;
