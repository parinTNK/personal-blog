import React from "react";

function CardPost({ title, description, category, image, link, author, date}) {
  return (
    
    <div className="p-4 ">
      <img src={image} alt={title} className="w-full h-112 object-cover rounded-md" />
      <span className="text-sm text-green-600  mt-5 bg-green-100 inline-block py-1 px-4 rounded-full" >{category}</span>
      <h2 className="font-bold text-lg mt-4">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
        <div className="flex flex-row items-center mt-4 text-gray-600">
      <img
        src="https://s3-alpha-sig.figma.com/img/14d0/ff1e/c045ed1d618b25c84aa4327331ecdaaf?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=JHQ2w3412HO781E-WpCXE8ZvxiBZ1-bU7AMS6uX1rYQxj36cHvat46R6zecHKjy6skL4NpNbBGph7hwEVKdCLK~3atoUDPhuDYCy0DjcFSNqW9pzCWHLGpwD-Cdm2R8WJwzkH9EXUJFUqJwBcLuINtfRFfB26CpDUsnVPf3Sns9-mUaDY-nJmS5pWlpES5~0CYbDWXQtIzFtPHNojdqjwqYW3WZIBdLD3vJHviJwphXnnnYVK7--WnGqf58nZfUi7lHEi-7SfLr9FXppVQ0cRSLRu5xNq2KmnSfLxIK7GAANZsnZxkahHsjy8s-RH6VUn8FjtjthHA5E58FIGd3nLA__"
        alt="Hero section image showing a person with a cat"
        className="h-9 w-9 object-cover rounded-full shadow-lg mr-4 mb-8 lg:mb-0"/>
        <span className="">{author}</span>
        <span className=" mx-4">|</span>
        <p className="">{date}</p>
        </div>

        
      
    </div>
  );
}

export default CardPost;