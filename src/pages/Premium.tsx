
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { toast } from "react-hot-toast";

const Premium = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = (plan: "monthly" | "semester") => {
    if (!user) {
      toast.error("Please log in to continue.");
      return navigate("/login");
    }

    toast.success(`✅ ${plan === "monthly" ? "Monthly" : "Semester"} plan selected`);

    setTimeout(() => {
      updateUser({ isPremiumSeller: true, isPremium: true })
      navigate(`/payment?plan=${plan}`);
    }, 800);
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">💎 CampusPlug Premium</h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          Get noticed faster. Sell smarter. Upgrade your selling experience.
        </p>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Monthly Plan */}
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow">
            <h2 className="text-lg font-semibold mb-1">📅 Monthly Plan</h2>
            <p className="text-blue-600 font-bold text-xl mb-3">₦500 / month</p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-4 list-disc pl-4">
              <li>📷 Upload multiple images</li>
              <li>📈 View count & WhatsApp clicks</li>
              <li>📌 Pinned as featured</li>
              <li>⏳ 45 days visibility</li>
              <li>✅ Verified badge</li>
            </ul>
            <button
              onClick={() => handlePlanSelect("monthly")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition text-sm font-medium"
            >
              Choose Monthly Plan
            </button>
          </div>

          {/* Semester Plan */}
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow">
            <h2 className="text-lg font-semibold mb-1">📚 Semester Plan</h2>
            <p className="text-blue-600 font-bold text-xl mb-3">₦1,500 / semester</p>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-4 list-disc pl-4">
              <li>All Monthly features</li>
              <li>🏪 Dedicated Seller Profile Page</li>
              <li>👥 Priority on Explore</li>
              <li>💼 Best for serious student sellers</li>
            </ul>
            <button
              onClick={() => handlePlanSelect("semester")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition text-sm font-medium"
            >
              Choose Semester Plan
            </button>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-6 rounded-lg space-y-4 text-sm mb-10">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">🔓 Free Tier Limitations</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
            <li>Only 1 image per listing</li>
            <li>Visibility lasts 30 days</li>
            <li>No analytics, no verification badge</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            to="/explore"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Explore
          </Link>

          <p className="text-xs text-center text-gray-400 dark:text-gray-600 sm:mt-0">
            Payment integration coming soon via Paystack / Flutterwave.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
