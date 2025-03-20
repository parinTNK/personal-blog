import React, { useState } from "react";
import ArticleBar from "./ui/ArticleBar";
import CardPost from "./ui/CardPost";
import { blogPosts } from "@/data/blogPosts"; // Import blog post data

function Articles() {
  const [selectedCategory, setSelectedCategory] = useState("Highlight");

  // Filter posts based on the selected category
  const filteredPosts =
    selectedCategory === "Highlight"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="container mx-auto py-8">
      {/* Pass setSelectedCategory to ArticleBar */}
      <ArticleBar setSelectedCategory={setSelectedCategory} />

      {/* Render filtered posts */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mt-6">
        {filteredPosts.map((post) => (
          <CardPost
            key={post.id}
            title={post.title}
            description={post.description}
            category={post.category}
            image={post.image}
            link={post.link}
            author={post.author}
            date={post.date}
          />
        ))}
      </div>
    </div>
  );
}

export default Articles;