import React from 'react';
import { Link } from 'react-router-dom';

function PostTags({ tags = [] }) {
  // ตรวจสอบว่ามี tags หรือไม่
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 my-8">
      <span className="font-semibold text-gray-700">Tags:</span>
      {tags.map((tag, index) => (
        <Link
          key={index}
          to={`/blog/tag/${tag.id || tag}`}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
        >
          {tag.name || tag}
        </Link>
      ))}
    </div>
  );
}

export default PostTags;