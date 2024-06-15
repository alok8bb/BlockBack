import { FundCategories, FundCategory } from "@/lib/types";

export const CategoryCard: React.FC<{
  category: FundCategory;
}> = ({ category }) => {
  let color = "";
  if (category === "Health and Wellness") {
    color = "bg-pink-200";
  } else if (category === "Technology") {
    color = "bg-yellow-200";
  } else if (category === "Social Impact") {
    color = "bg-blue-200";
  } else if (category === "Business and Entrepreneurship") {
    color = "bg-green-200";
  } else if (category === "Creative Arts") {
    color = "bg-red-200";
  } else if (category === "Other") {
    color = "bg-green-200";
  }

  return (
    <span className={`p-1 px-2 w-fit ${color} text-xs rounded-lg text-black`}>
      {category}
    </span>
  );
};
