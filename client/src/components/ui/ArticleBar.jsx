import React, { useState, useEffect } from "react";
import axios from "axios";
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

const API_BASE_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

function ArticleBar({ setSelectedCategory, setSearchQuery }) {
  const [activeCategory, setActiveCategory] = useState("Highlight");
  const [categories, setCategories] = useState([
    { id: null, name: "Highlight" },
    { id: 1, name: "Cat" },
    { id: 2, name: "Inspiration" },
    { id: 3, name: "General" }
  ]);
  const [inputValue, setInputValue] = useState("");

  // ดึงข้อมูลหมวดหมู่จาก API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/categories`);
        // เพิ่ม Highlight เป็นตัวแรก
        const allCategories = [
          { id: null, name: "Highlight" },
          ...response.data.categories
        ];
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSelectedCategory(category);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(inputValue);
  };

  // ดีเลย์การค้นหาเมื่อผู้ใช้หยุดพิมพ์
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  return (
    <section className="container my-10 mx-auto">
      <div className="md:flex md:justify-between md:items-center md:rounded-lg py-4 px-6 bg-[#EFEEEB]">
        <ul className="hidden md:flex text-base">
          {categories.map((category) => (
            <li key={category.id || "highlight"}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category.name);
                }}
                className={`py-3 px-5 text-gray-600 hover:bg-gray-300 hover:rounded-lg hover:text-black transition-all duration-300 m-2 ${
                  activeCategory === category.name ? "text-black bg-gray-300 rounded-lg" : ""
                }`}
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search"
            className="mb-4 md:mb-0 bg-white"
            aria-label="Search articles"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Search
            strokeWidth={1}
            size={16}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
          />
        </form>
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