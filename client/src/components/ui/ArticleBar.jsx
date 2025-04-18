import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";


function ArticleBar({ setSelectedCategory }) {
  const [activeCategory, setActiveCategory] = useState("Highlight"); // Default to "Highlight"

  const handleCategoryClick = (category) => {
    setActiveCategory(category); // Update the active category
    setSelectedCategory(category); // Notify parent component
  };

  return (
    <section className="container my-10 mx-auto">
      <div className="md:flex md:justify-between md:items-center md:rounded-lg py-4 px-6 bg-[#EFEEEB]">
        <ul className="hidden md:flex text-base">
          {["Highlight", "Cat", "Inspiration", "General"].map((category) => (
            <li key={category}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category);
                }}
                className={`py-3 px-5 text-gray-600 hover:bg-gray-300 hover:rounded-lg hover:text-black transition-all duration-300 m-2 ${
                  activeCategory === category ? " text-black bg-gray-300 rounded-lg" : ""
                }`}
              >
                {category}
              </a>
            </li>
          ))}
        </ul>

        <div className="relative">
          <Input
            type="text"
            placeholder="Search"
            className="mb-4 md:mb-0 bg-white"
            aria-label="Search articles"
          />
          <Search
            strokeWidth={1}
            size={16}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          />
        </div>
        <div className="md:hidden">
          <h3 className="text-base text-gray-600 mb-1">Category</h3>
          <SelectArticle
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </div>
    </section>
  );
}

export default ArticleBar;

function SelectArticle({ activeCategory, setActiveCategory, setSelectedCategory }) {
  return (
    <Select
      onValueChange={(value) => {
        setActiveCategory(value);
        setSelectedCategory(value); // Notify parent component about the selected category
      }}
      value={activeCategory}
    >
      <SelectTrigger className="w-full bg-white text-gray-600">
        <SelectValue placeholder="Highlight" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          <SelectItem value="Highlight">Highlight</SelectItem>
          <SelectItem value="Cat">Cat</SelectItem>
          <SelectItem value="Inspiration">Inspiration</SelectItem>
          <SelectItem value="General">General</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}