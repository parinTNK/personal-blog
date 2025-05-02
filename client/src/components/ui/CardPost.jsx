import React from "react";
import { Link } from "react-router-dom";

function CardPost({ id, title, description, category, image, author, date }) {
  const authorData = typeof author === 'object' ? author : { name: author };
  const name = authorData?.name || 'Unknown Author';
  const username = authorData?.username || '';
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      console.error("Invalid date format:", error);
      return dateString;
    }
  };
  
  return (
    <article className="rounded-xl overflow-hidden border border-gray-200 bg-white">
      <Link to={`/view-post/${id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={image || "https://placehold.co/600x400?text=No+Image"} 
            alt={title} 
            className="w-full h-full object-cover hover:scale-105 transition-all duration-300"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block bg-green-200 px-3 py-1 text-base rounded-full text-green-600">
            {category}
          </span>
          <span className="text-sm text-gray-500">{formatDate(date)}</span>
        </div>
        <Link to={`/view-post/${id}`}>
          <h3 className="text-xl font-semibold hover:text-gray-600 line-clamp-2">{title}</h3>
        </Link>
        <p className="text-gray-600 mt-2 text-base line-clamp-3">{description}</p>
        <div className="mt-4 flex items-center">
          {authorData.profile_pic ? (
            <img 
              src={authorData.profile_pic} 
              alt={name} 
              className="h-10 w-10 rounded-full mr-2 object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <span className="text-base text-gray-500">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="text-base font-medium">{name}</p>
            {username && <p className="text-sm text-gray-500">@{username}</p>}
          </div>
        </div>
      </div>
    </article>
  );
}

export default CardPost;
