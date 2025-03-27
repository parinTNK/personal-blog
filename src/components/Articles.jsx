import React, { useState, useEffect } from "react";
import axios from "axios";
import ArticleBar from "./ui/ArticleBar";
import CardPost from "./ui/CardPost";

function Articles() {
  const [blogPosts, setBlogPosts] = useState([]); // State to store fetched posts
  const [selectedCategory, setSelectedCategory] = useState("Highlight");
  const [loading, setLoading] = useState(true); // State to handle loading
  const [limit, setLimit] = useState(6);

  // Fetch blog posts from the API using axios
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get("https://blog-post-project-api.vercel.app/posts", {
          params: {
            category: selectedCategory === "Highlight" ? undefined : selectedCategory,
            limit,
          },
        });
        console.log(response.data.posts);
        setBlogPosts(response.data.posts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, limit]); // Refetch posts when selectedCategory or page changes

  useEffect(() => {
    setLimit(6);
  },[selectedCategory])


  return (
    <div className="container mx-auto py-8">
      <h3 className="px-4 font-semibold text-2xl">Latest articles</h3>
      {/* Pass setSelectedCategory to ArticleBar */}
      <ArticleBar setSelectedCategory={setSelectedCategory} />

      {/* Show loading state */}
      {loading ? (
        <p className="text-center mt-6">Loading articles...</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Render filtered posts */}
            {blogPosts.map((post) => (
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
          
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setLimit((limit + 6))}
              className="px-4 py-2 bg-gray-300 rounded-lg mr-2"
            >
              View More
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default Articles;