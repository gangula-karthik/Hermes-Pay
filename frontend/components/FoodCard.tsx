import React from 'react';
import { Checkbox, Image, Chip, cn } from "@nextui-org/react";

type FoodItem = {
  name: string;
  image: string;
  price: string;
};

type FoodCardProps = {
  foodItem: FoodItem;
  onSelect: (item: FoodItem, isSelected: boolean) => void;
};

const FoodCard: React.FC<FoodCardProps> = ({ foodItem, onSelect }) => {
  const [isSelected, setIsSelected] = React.useState(false);

  const handleSelection = (selected: boolean) => {
    setIsSelected(selected);
    onSelect(foodItem, selected);
  };

  return (
    <Checkbox
      aria-label={foodItem.name}
      className={cn(
        "inline-flex w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg",
        "hover:bg-gray-100 dark:hover:bg-gray-700 items-stretch justify-start",
        "cursor-pointer border-2 border-transparent overflow-hidden",
        isSelected ? "border-primary" : "border-gray-200 dark:border-gray-600"
      )}
      isSelected={isSelected}
      onValueChange={handleSelection}
    >
      <div className="w-full flex flex-row sm:flex-col">
        {/* Food image */}
        <div className="w-1/3 sm:w-full aspect-square sm:aspect-[4/3] overflow-hidden flex items-center justify-center">
          <Image
            src={foodItem.image}
            alt={`Image of ${foodItem.name}`}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Food details and chip */}
        <div className="flex flex-col justify-between p-4 w-2/3 sm:w-full">
          <div>
            <div className="text-lg font-bold text-black dark:text-white line-clamp-1 sm:line-clamp-2">
              {foodItem.name}
            </div>
            <div className="text-primary-500 dark:text-primary-400 text-base">
              {foodItem.price}
            </div>
          </div>

          {/* Selected status indicator */}
          <div className="self-end mt-2">
            <Chip
              color={isSelected ? "success" : "default"}
              size="sm"
              variant="flat"
              className="whitespace-nowrap"
            >
              {isSelected ? "Selected" : "Select"}
            </Chip>
          </div>
        </div>
      </div>
    </Checkbox>
  );
};

export default FoodCard;