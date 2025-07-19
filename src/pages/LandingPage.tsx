
import { useEffect } from "react";
import Button from "../shared/Button";
import CategoryCard from "../shared/CategoryCard";
import SectionHeader from "../shared/SectionHeader";
// import HeroImage from "../assets/HeroImage.png";
import { Link, useNavigate } from "react-router-dom";

const categories = [
  { label: "Phones", emoji: "📱" },
  { label: "Food", emoji: "🍔" },
  { label: "Fashion", emoji: "🧥" },
  { label: "Perfumes", emoji: "🧴" },
  { label: "Gadgets", emoji: "🎧" },
  { label: "Services", emoji: "🛠️" },
  { label: "Books", emoji: "📚" },
  { label: "Furniture", emoji: "🛋️" },
  { label: "Sports", emoji: "⚽" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "CampusPlug - Buy. Sell. Plug In.";
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <div className="w-full max-w-3xl px-4 py-8 flex flex-col items-center gap-6">
        
        <div className="w-full flex flex-col items-center">
          {/* <img
            src={HeroImage}
            alt="CampusPlug Hero"
            className="w-3/5 sm:w-2/5 md:w-1/3 mb-4 rounded-xl shadow-md dark:shadow-none"
          /> */}
          <h1 className="text-3xl font-bold mb-2">CampusPlug</h1>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Buy. Sell. Plug In. — Marketplace built for students.
          </p>
        </div>

        
        <SectionHeader title="Browse Categories" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          {categories.map((cat) => (
            <CategoryCard key={cat.label} label={cat.label} emoji={cat.emoji} />
          ))}
        </div>

        
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Link to="/explore">
            <Button label="Explore Listings" fullWidth />
          </Link>
          <div className="flex justify-between gap-4">
            <Button
              label="Login"
              variant="outline"
              fullWidth
              onClick={() => navigate("/login")}
            />
            <Button
              label="Sign Up"
              variant="outline"
              fullWidth
              onClick={() => navigate("/login")}
            />
          </div>
        </div>

        <div className="w-full max-w-lg bg-blue-50 dark:bg-blue-900/20 text-center rounded-md p-6 mt-10">
          <h2 className="text-lg font-semibold mb-2">Want to Sell on CampusPlug?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Get verified as a student seller and start listing your items to thousands of buyers in your school.
          </p>
          <Link
            to="/verify"
            className="inline-block px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            👤 Get Verified
          </Link>
        </div>

        
        <footer className="mt-10 text-sm text-gray-400 dark:text-gray-500">
          CampusPlug © 2025
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
