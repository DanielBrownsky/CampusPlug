
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../components/AuthProvider";

const Payment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get("plan");
  const [loading, setLoading] = useState(false);

  const price = plan === "semester" ? 1500 : 500;
  const label = plan === "semester" ? "Semester Plan" : "Monthly Plan";

  useEffect(() => {
    if (!user) {
      toast.error("Please login to proceed with payment");
      navigate("/login");
    }
    if (!plan || (plan !== "monthly" && plan !== "semester")) {
      toast.error("Invalid plan selected");
      navigate("/premium");
    }
  }, [user, plan, navigate]);

  const handlePay = () => {
    setLoading(true);
    // 👇real payment logic later
    setTimeout(() => {
      toast.success(`✅ ${label} activated! Redirecting...`);

      navigate(`/add?plan=${plan}`);

    }, 2000);
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-md mx-auto border rounded-lg p-6 bg-white dark:bg-gray-800 shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">🔐 Confirm Payment</h1>
        <p className="text-sm text-center mb-6 text-gray-500 dark:text-gray-400">
          You're about to activate <span className="font-semibold text-blue-600">{label}</span>
        </p>

        <div className="mb-6 text-center">
          <p className="text-xl font-semibold">Amount: ₦{price.toLocaleString()}</p>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <Link
          to="/premium"
          className="block mt-6 text-sm text-center text-blue-600 hover:underline"
        >
          ← Back to Premium Page
        </Link>
      </div>

      <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-6">
        Payments will soon be securely processed with Paystack / Flutterwave
      </p>
    </div>
  );
};

export default Payment;
