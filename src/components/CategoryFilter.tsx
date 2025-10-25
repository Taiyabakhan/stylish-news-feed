import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  "general",
  "technology",
  "business",
  "sports",
  "health",
  "entertainment",
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onSelectCategory(category)}
          variant={selectedCategory === category ? "default" : "outline"}
          className="capitalize"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
