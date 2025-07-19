
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { toast } from "react-hot-toast";

const defaultCategories = [
  "Phones", "Food", "Fashion", "Perfumes", "Books & Handouts",
  "Gadgets", "Home Items", "Services"
];

const defaultCampuses = [
  "OAUSTECH", "OAU", "UI", "FUTA", "UNILAG", "UNIBEN", "LASU", "UNILORIN",
  "UNN", "ABU", "MAPOLY", "YABATECH", "FPI", "LAUTECH"
];

const AddListing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const selectedPlan = searchParams.get("plan");
  const isPlanPremium = selectedPlan === "monthly" || selectedPlan === "semester";

  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Phones");
  const [customCategory, setCustomCategory] = useState("");
  const [campus, setCampus] = useState("OAUSTECH");
  const [customCampus, setCustomCampus] = useState("");
  const [condition, setCondition] = useState("Fairly Used");
  const [whatsapp, setWhatsapp] = useState("");
  const [isPremium, setIsPremium] = useState(isPlanPremium);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (isPlanPremium) setIsPremium(true);
  }, [isPlanPremium]);

  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const limited = isPremium ? files.slice(0, 5) : files.slice(0, 1);
    setImages(prev => [...prev, ...limited]);

    const readers = limited.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(newPreviews => {
      setImagePreviews(prev => [...prev, ...newPreviews])
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return toast.error("Please upload image(s)");
    if (!whatsapp) return toast.error("Please enter your WhatsApp number");
    if (!username) return toast.error("Please enter your username");

    const createdAt = Date.now();
    const expiresAt = createdAt + (isPremium ? 45 : 30) * 24 * 60 * 60 * 1000;

    const listing = {
      id: createdAt.toString(),
      title,
      username,
      description,
      price: Number(price),
      category: category === "Other" ? customCategory : category,
      location: campus === "Other" ? customCampus : campus,
      condition,
      imageUrls: imagePreviews,
      email: user?.email || "",
      whatsapp,
      isPremium,
      createdAt,
      expiresAt,
      premiumPlan: isPremium ? selectedPlan : null
    };

    const existing = JSON.parse(localStorage.getItem("campusplug-listings") || "[]");
    localStorage.setItem("campusplug-listings", JSON.stringify([listing, ...existing]));

    
    setTitle("");
    setUsername("");
    setDescription("");
    setPrice("");
    setCategory("Phones");
    setCustomCategory("");
    setCampus("OAUSTECH");
    setCustomCampus("");
    setCondition("Fairly Used");
    setImages([]);
    setImagePreviews([]);
    setWhatsapp("");
    setIsPremium(false);

    toast.success(
      isPremium
        ? "🎉 Premium listing submitted!"
        : "🎉 Listing submitted! You can add another or view your dashboard"
    );
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-white text-gray-800 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Add New Listing</h1>

      {isPremium && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 text-yellow-800 dark:text-yellow-100 rounded-md p-4 mb-6">
          <p className="text-sm font-medium">💎 Premium Mode Active ({selectedPlan === "monthly" ? "Monthly" : "Semester"})</p>
          <p className="text-xs mt-1">This listing will enjoy extended 45-day visibility and premium features.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            placeholder="e.g. PlugMaster"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 font-medium">Price (₦)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">WhatsApp Number</label>
          <input
            type="tel"
            placeholder="e.g. 08123456789"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
            >
              {defaultCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {category === "Other" && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category"
                className="mt-2 w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800"
              />
            )}
          </div>

          <div className="flex-1">
            <label className="block mb-1 font-medium">Campus</label>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
            >
              {defaultCampuses.map((camp) => (
                <option key={camp} value={camp}>{camp}</option>
              ))}
              <option value="Other">Other</option>
            </select>
            {campus === "Other" && (
              <input
                type="text"
                value={customCampus}
                onChange={(e) => setCustomCampus(e.target.value)}
                placeholder="Enter your campus"
                className="mt-2 w-full px-4 py-2 rounded-md border bg-white dark:bg-gray-800"
              />
            )}
          </div>
        </div>

        {["Phones", "Fashion", "Gadgets", "Home Items", "Books & Handouts"].includes(category) && (
          <div>
            <label className="block mb-1 font-medium">Condition</label>
            <div className="flex gap-4">
              {["New", "Fairly Used"].map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name="condition"
                    value={opt}
                    checked={condition === opt}
                    onChange={(e) => setCondition(e.target.value)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">
            Upload {isPremium ? "Multiple Images" : "One Image"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            multiple={isPremium}
            className="text-sm"
          />
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {imagePreviews.map((url, idx) => (
                <div key={idx} className="rounded-md border overflow-hidden bg-white p-1 dark:bg-gray-800">
                <img
                
                src={url}
                  alt={`Preview ${idx + 1}`}
                  className="h-24 w-full object-cover rounded-md border"
                /></div>
              ))}
            </div>
          )}
        </div>

        {/* Premium toggle */}
        {!isPlanPremium && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 text-yellow-800 dark:text-yellow-100 rounded-md p-4">
            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
              />
              Make this a <span className="font-bold">Premium Listing</span>
            </label>
            <p className="text-xs mt-1">
              Premium listings last 45 days & allow multiple images.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Submit Listing
        </button>

        <div className="flex gap-4 mt-6">
          <a href="/dashboard" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border text-sm rounded-md">📋 Dashboard</a>
          <a href="/explore" className="px-4 py-2 bg-white dark:bg-gray-700 border text-sm rounded-md">🔍 Explore Listings</a>
        </div>
      </form>
    </div>
  );
};

export default AddListing;


