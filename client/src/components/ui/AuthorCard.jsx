import React from 'react';


function AuthorCard({ author }) {
  // ตรวจสอบว่า author มีค่าหรือไม่
  if (!author) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
      <div className="mb-3">
        <span className="text-gray-500 text-sm">Author</span>
      </div>
      
      <div className="flex items-center mb-4">
        {author.profile_pic ? (
          <img
            src={author.profile_pic}
            alt={author.name}
            className="h-14 w-14 object-cover rounded-full mr-3"
          />
        ) : (
          <div className="h-14 w-14 bg-gray-300 rounded-full flex items-center justify-center mr-3">
            <span className="text-xl font-semibold text-gray-600">
              {author.name ? author.name.charAt(0).toUpperCase() : 'A'}
            </span>
          </div>
        )}
        
        <div>
          <h3 className="text-xl font-semibold">{author.name}</h3>
          {author.username && <p className="text-sm text-gray-500">@{author.username}</p>}
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-600 text-sm leading-relaxed">
          {author.bio || "No bio available for this author."}
        </p>
      </div>
      
    
    </div>
  );
}

export default AuthorCard;
