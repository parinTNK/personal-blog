import React from "react";
import { useNavigate } from "react-router-dom";

function CardPost({ id, title, description, category, image, author, date }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/view-post/${id}`); // Navigate to the ViewPost page with the post ID
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <img
        src={image}
        alt={title}
        className="w-full md:h-112 h-60 object-cover rounded-md cursor-pointer"
        onClick={handleNavigate}
      />
      <span className="text-sm text-green-600 mt-5 bg-green-100 inline-block py-1 px-4 rounded-full md:text-base lg:text-lg">
        {category}
      </span>
      <h2
        className="font-bold text-lg mt-4 md:text-xl lg:text-2xl cursor-pointer"
        onClick={handleNavigate}
      >
        {title}
      </h2>
      <p className="text-gray-600 mt-2 md:text-base lg:text-lg">{description}</p>

      <div className="flex flex-row items-center mt-4 text-gray-600 text-sm md:text-base lg:text-lg">
        <div className="items-center justify-center">
          <img
            src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
            alt="Author"
            className="h-9 w-9 object-cover rounded-full shadow-lg mr-4"
          />
        </div>
        <span className="text-sm md:text-base lg:text-lg">{author}</span>
        <span className="mx-4">|</span>
        <p className="text-sm md:text-base lg:text-lg">{date}</p>
      </div>
    </div>
  );
}

export default CardPost;