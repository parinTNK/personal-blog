import React from 'react'

function AuthorCard({ name,  }) {
  return (
    <>
        <div className='md:w-3/4 w-full bg-gray-50 shadow-sm rounded-lg p-6 h-70 md:h-100 md:absolute md:sticky md:top-10 md:bottom-10'>
            <div className='flex items-center mb-4'>
            <img
            src="https://s3-alpha-sig.figma.com/img/14d0/ff1e/c045ed1d618b25c84aa4327331ecdaaf?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=JHQ2w3412HO781E-WpCXE8ZvxiBZ1-bU7AMS6uX1rYQxj36cHvat46R6zecHKjy6skL4NpNbBGph7hwEVKdCLK~3atoUDPhuDYCy0DjcFSNqW9pzCWHLGpwD-Cdm2R8WJwzkH9EXUJFUqJwBcLuINtfRFfB26CpDUsnVPf3Sns9-mUaDY-nJmS5pWlpES5~0CYbDWXQtIzFtPHNojdqjwqYW3WZIBdLD3vJHviJwphXnnnYVK7--WnGqf58nZfUi7lHEi-7SfLr9FXppVQ0cRSLRu5xNq2KmnSfLxIK7GAANZsnZxkahHsjy8s-RH6VUn8FjtjthHA5E58FIGd3nLA__"
            alt="Author"
            className="h-13 w-13 object-cover rounded-full shadow-lg mr-4"
          />

                <div>
                    <h3 className='text-gray-700 text-sm'>Author</h3>
                    <h3 className='text-lg font-semibold'>{name}</h3>
                </div>
            </div>
            <hr />

            <div className='mt-4'>
                <p className='text-gray-700 mb-4'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non urna nec nisi facilisis fringilla.</p>
            </div>
        </div>
    </>
  )
}

export default AuthorCard