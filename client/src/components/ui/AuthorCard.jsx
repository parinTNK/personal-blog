import React from 'react';

function AuthorCard({ author }) {
  const authorData = typeof author === 'object' ? author : { name: author };
  const name = authorData?.name || 'Unknown Author';
  const username = authorData?.username || '';
  const profilePic = authorData?.profile_pic || null;
  const bio = authorData?.bio || 'No bio available';

  return (
    <div className='md:w-3/4 w-full md:h-[500px] h-[300px] bg-gray-50 shadow-sm rounded-lg p-6 md:sticky md:top-10'>
      <div className='flex items-center mb-4'>
        {profilePic ? (
          <img
            src={profilePic}
            alt={name}
            className="h-12 w-12 object-cover rounded-full shadow-lg mr-4"
          />
        ) : (
          <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center mr-4 shadow-lg">
            <span className="text-xl text-gray-600 font-semibold">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div>
          <h3 className='text-gray-700 text-sm'>Author</h3>
          <h3 className='text-lg font-semibold'>{name}</h3>
          {username && <p className='text-sm text-gray-500'>@{username}</p>}
        </div>
      </div>
      <hr />

      <div className='mt-4'>
        <p className='text-gray-700 text-xl'>{bio}</p>
      </div>
    </div>
  );
}

export default AuthorCard;
