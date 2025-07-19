
import { Link } from "react-router-dom";

const PremiumPromoCard = () => {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-400 dark:border-yellow-600 p-4 rounded-lg mb-6">
      <h3 className="font-bold text-yellow-800 dark:text-yellow-300 text-lg mb-1">
        📢 Get Featured on CampusPlug!
      </h3>
      <p className="text-sm text-gray-700 dark:text-gray-400 mb-3">
        Boost your listings, gain more views, and rank higher on the Explore page.
      </p>
      <Link
        to="/premium"
        className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 text-sm rounded-md transition"
      >
        Go Premium
      </Link>
    </div>
  );
};

export default PremiumPromoCard;
