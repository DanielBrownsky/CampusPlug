
import type { FC } from "react";

type CategoryCardProps = {
  label: string;
  emoji: string;
};

const CategoryCard: FC<CategoryCardProps> = ({ label, emoji }) => {
  return (
    <div className="flex flex-col items-center p-4 border rounded-xl shadow-sm hover:shadow-md transition">
      <span className="text-3xl">{emoji}</span>
      <p className="text-sm mt-2 font-medium">{label}</p>
    </div>
  );
};

export default CategoryCard;
