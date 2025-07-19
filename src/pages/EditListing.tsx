import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { toast } from "react-hot-toast";
import { type Listing } from "../shared/ListingCard";
import { ArrowLeft, X } from "lucide-react";

const defaultCategories = [
  "Phones", "Food", "Fashion", "Perfumes",
  "Books & Handouts", "Gadgets", "Home Items", "Services"
];

const defaultCampuses = [
  "OAUSTECH", "OAU", "UI", "FUTA", "UNILAG", "UNIBEN",
  "LASU", "UNILORIN", "UNN", "ABU", "MAPOLY", "YABATECH", "FPI", "LAUTECH"
];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState<Listing | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const all = localStorage.getItem("campusplug-listings");
    const parsed: Listing[] = all ? JSON.parse(all) : [];
    const match = parsed.find((item) => item.id === id && item.email === user?.email);

    if (!match) {
      toast.error("Listing not found or you're not the owner.");
      navigate("/dashboard");
      return;
    }

    const now = Date.now();
    const duration = (match.isPremium ? 45 : 30) * 24 * 60 * 60 * 1000;
    const expired = now - Number(match.id) > duration;

    setForm(match);
    setImageUrls(match.imageUrls || (match.imageUrl ? [match.imageUrl] : []));
    setIsExpired(expired);
  }, [id, user, navigate]);

  const handleChange = (field: keyof Listing, value: any) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImageUrls((prev) => [...prev, ...newUrls]);
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((item) => item !== url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const all = localStorage.getItem("campusplug-listings");
    const parsed: Listing[] = all ? JSON.parse(all) : [];

    const updated = parsed.map((item) =>
      item.id === form.id
        ? { ...form, imageUrls, imageUrl: imageUrls[0] || "" }
        : item
    );

    localStorage.setItem("campusplug-listings", JSON.stringify(updated));
    toast.success("✅ Listing updated successfully!");
    navigate("/dashboard");
  };

  if (!form) return null;

  return (
    <div className="min-h-screen px-4 py-8 bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-xl mx-auto space-y-6">
        
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-100 dark:hover:bg-gray-800 transition md:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold"> Edit Listing</h1>
        </div>

        {isExpired && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-sm p-3 rounded-md border border-red-300 dark:border-red-700">
            ⚠️ This listing is expired. You can edit and re-submit it to renew.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
              required
              disabled={isExpired}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
              disabled={isExpired}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-medium">Price (₦)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
              disabled={isExpired}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block mb-1 font-medium">WhatsApp Number</label>
            <input
              type="tel"
              value={form.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
              disabled={isExpired}
            />
          </div>

          {/* Category & Campus */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Category</label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
                disabled={isExpired}
              >
                {defaultCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-1 font-medium">Campus</label>
              <select
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border"
                disabled={isExpired}
              >
                {defaultCampuses.map((camp) => (
                  <option key={camp} value={camp}>{camp}</option>
                ))}
              </select>
            </div>
          </div>

          
          <div>
            <label className="block mb-1 font-medium">Condition</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="condition"
                  value="New"
                  checked={form.condition === "New"}
                  onChange={() => handleChange("condition", "New")}
                  disabled={isExpired}
                />
                New
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="condition"
                  value="Fairly Used"
                  checked={form.condition === "Fairly Used"}
                  onChange={() => handleChange("condition", "Fairly Used")}
                  disabled={isExpired}
                />
                Fairly Used
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium">Upload Image(s)</label>
            <input
              type="file"
              accept="image/*"
              multiple={form.isPremium}
              onChange={handleImageChange}
              className="text-sm"
              disabled={isExpired}
            />

            {imageUrls.length > 0 && (
              <div className="mt-3 flex gap-3 flex-wrap">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-[-6px] right-[-6px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Premium notice */}
          {form.isPremium && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-100 text-xs p-3 rounded-md border border-yellow-300 dark:border-yellow-600">
              ⭐ This listing is Premium. This status cannot be changed from the edit screen.
            </div>
          )}

          {/* Save Button */}
          {!isExpired && (
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            >
              Save Changes
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditListing;
