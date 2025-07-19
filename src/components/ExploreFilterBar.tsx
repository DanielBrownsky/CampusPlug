
import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  selectedCampus: string;
  selectedCategory: string;
  onCampusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onReset?: () => void;
};

const defaultCampuses = [
  "OAUSTECH", "OAU", "UI", "FUTA", "UNILAG", "UNIBEN", "LASU", "UNILORIN", "UNN", "ABU", "MAPOLY", "YABATECH", "FPI", "LAUTECH"
];

const defaultCategories = [
  "Phones",
  "Food",
  "Fashion",
  "Perfumes",
  "Books & Handouts",
  "Gadgets",
  "Home Items",
  "Services",
];

const ExploreFilterBar: FC<Props> = ({
  selectedCampus,
  selectedCategory,
  onCampusChange,
  onCategoryChange,
  onReset,
}) => {
  const navigate = useNavigate();
  const [customCampus, setCustomCampus] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [campuses, setCampuses] = useState<string[]>(() => {
    const saved = localStorage.getItem("customCampuses");
    return [...defaultCampuses, ...(saved ? JSON.parse(saved) : [])];
  });
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("customCategories");
    return [...defaultCategories, ...(saved ? JSON.parse(saved) : [])];
  });

  const campusIsCustom = !campuses.includes(selectedCampus) && selectedCampus !== "All";
  const categoryIsCustom = !categories.includes(selectedCategory) && selectedCategory !== "All";

  const allCampuses = ["All", ...campuses, campusIsCustom ? "Other" : "Other"];
  const allCategories = ["All", ...categories, categoryIsCustom ? "Other" : "Other"];

  const saveCampus = () => {
    if (customCampus.trim() && !campuses.includes(customCampus)) {
      const updated = [...campuses, customCampus];
      setCampuses(updated);
      localStorage.setItem("customCampuses", JSON.stringify(updated.filter(c => !defaultCampuses.includes(c))));
      onCampusChange(customCampus);
      setCustomCampus("");
      navigate("/explore");
    }
  };

  const saveCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory)) {
      const updated = [...categories, customCategory];
      setCategories(updated);
      localStorage.setItem("customCategories", JSON.stringify(updated.filter(c => !defaultCategories.includes(c))));
      onCategoryChange(customCategory);
      setCustomCategory("");
      navigate("/explore");
    }
  };

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow mb-6 flex flex-col gap-4 sm:flex-col md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full">
        
        <select
          value={campusIsCustom ? "Other" : selectedCampus}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "Other") {
              onCampusChange("");
            } else {
              onCampusChange(value);
              setCustomCampus("");
              navigate("/explore");
            }
          }}
          className="flex-1 min-w-[180px] px-4 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 shadow-sm"
        >
          {allCampuses.map((campus) => (
            <option key={campus} value={campus}>
              {campus === "All" ? "All Campuses" : campus}
            </option>
          ))}
        </select>

        {selectedCampus === "" && (
          <div className="flex gap-2 flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Enter your campus"
              value={customCampus}
              onChange={(e) => setCustomCampus(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 shadow-sm"
            />
            <button
              onClick={saveCampus}
              className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:opacity-90"
            >
              Save
            </button>
          </div>
        )}

        
        <select
          value={categoryIsCustom ? "Other" : selectedCategory}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "Other") {
              onCategoryChange("");
            } else {
              onCategoryChange(value);
              setCustomCategory("");
              navigate("/explore");
            }
          }}
          className="flex-1 min-w-[180px] px-4 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 shadow-sm"
        >
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        {selectedCategory === "" && (
          <div className="flex gap-2 flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Enter category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 shadow-sm"
            />
            <button
              onClick={saveCategory}
              className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:opacity-90"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Reset Button */}
      {onReset && (
        <div className="w-full sm:w-auto flex justify-end">
          <button
            onClick={onReset}
            className="text-sm text-blue-600 dark:text-blue-400 underline hover:opacity-80"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreFilterBar;
