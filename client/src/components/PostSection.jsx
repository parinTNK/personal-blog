import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthorCard from '@/components/ui/AuthorCard';
import ReactMarkdown from 'react-markdown';
import InteractionBar from '@/components/ui/InteractionBar';
import Comments from '@/components/Comments';

function PostSection({ data }) {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className='container mx-auto md:pt-8 pb-4'>
      <div className='items-center justify-center flex md:mt-5 h-70 md:h-150 w-full relative'>
        <img 
          src={data.image || 'https://placehold.co/1200x600?text=No+Image'} 
          alt={data.title} 
          className='object-cover absolute w-full h-full md:rounded-3xl' 
        />
      </div>
      
      <main className='flex flex-col md:flex-row mt-5 md:mt-12'>
        <div className='flex w-full md:w-2/3 flex-col p-4'>
          <div className='flex flex-wrap gap-4 items-center mb-4'>
            <button 
              onClick={() => navigate('/')}
              className="text-base text-gray-600 bg-gray-100 inline-block py-2 px-5 rounded-full hover:bg-gray-200"
            >
              ← Back
            </button>
            
            <span className="text-base text-green-600 bg-green-100 inline-block py-2 px-5 rounded-full">
              {data.categories?.name || data.category || 'Uncategorized'}
            </span>
            
            <span className="text-gray-500 text-base">{formatDate(data.date)}</span>
          </div>
          
          <h2 className="md:text-6xl text-4xl font-bold mb-8">{data.title}</h2>
          
          <div className="prose prose-xl max-w-none">
            <ReactMarkdown
              components={{
                h2: (props) => <h2 className='mb-4 font-semibold text-3xl mt-8' {...props} />,
                h3: (props) => <h3 className='mb-3 font-semibold text-2xl mt-6' {...props} />,
                p: (props) => <p className='mb-5 leading-relaxed text-xl' {...props} />,
                ul: (props) => <ul className='list-disc pl-6 mb-5 text-xl' {...props} />,
                ol: (props) => <ol className='list-decimal pl-6 mb-5 text-xl' {...props} />,
                li: (props) => <li className='mb-2 text-xl' {...props} />,
                blockquote: (props) => <blockquote className='border-l-4 border-gray-300 pl-4 italic my-6 text-xl' {...props} />,
                a: (props) => <a className='text-blue-600 hover:underline text-xl' {...props} />
              }}
            >
              {data.content}
            </ReactMarkdown>
          </div>
          
          <div className='flex md:hidden mt-8'>
            <AuthorCard author={data.author} />
          </div>

          <InteractionBar />
          <Comments />
        </div>
        
        <div className='md:w-1/3 p-4 justify-center hidden md:flex'>
          <AuthorCard author={data.author} />
        </div>
      </main>
    </section>
  );
}

export default PostSection;
