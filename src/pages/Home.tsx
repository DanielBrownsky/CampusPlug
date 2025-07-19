import SectionHeader from "../shared/SectionHeader"
import CategoryCard from "../shared/CategoryCard"
import Button from "../shared/Button"
import HeroImage from "../assets/HeroImage.png"; // Update the path and filename as needed
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const categories = [
    {label: "phones", emoji: "📱"},
    {label: "Food", emoji: "🍔"},
    {label: "Fashion", emoji: "👗"},
    {label: "Perfumes", emoji: "🌸"},
    {label: "Books", emoji: "📚"},
    {label: "Furniture", emoji: "🛋️"},
    {label: "Gadgets", emoji: "📱"},
    {label: "Sports", emoji: "⚽"},
    {label: "Services", emoji: "🛠️"},

]

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center">
      <div className="w-full flex flex-col items-center">
          <img
            src={HeroImage}
            alt="CampusPlug Hero"
            className="w-3/5 sm:w-2/5 md:w-1/3 mb-4 rounded-xl shadow-md "
          />
          <h1 className="text-3xl font-bold mb-2">CampusPlug</h1>
          <p className="text-gray-800  text-center">
            Buy. Sell. Plug In. — Marketplace built for students.
          </p>
        </div>

        <SectionHeader title="Browse Catergories" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6 w-full max-w-xl">
          {categories.map((cat) => (
            <CategoryCard key={cat.label} label={cat.label} emoji={cat.emoji} />
          ))}
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
      
          <Link to="/explore">
             <Button label ="Explore Listings" fullWidth />
          </Link>
         
          <div className="flex justify-between gap-4">
            {/* <Link to="/login">
            <Button label="Login" variant="outline" fullWidth />
            </Link> */}
            <Button label="Login" variant="outline" fullWidth 
            onClick={() => navigate("/login")} />
            <Button label="Sign Up" variant="outline" fullWidth 
            onClick={() => navigate('/login')} />
          </div>
        </div>

        <footer className="mt-12 text-sm text-gray-400">CampusPlug © 2025</footer>
    </div>
  )
}

export default Home