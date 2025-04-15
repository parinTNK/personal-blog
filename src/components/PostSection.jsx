import React from 'react';
import ReactMarkdown from 'react-markdown';
import AuthorCard from '@/components/ui/AuthorCard';
import InteractionBar from '@/components/ui/InteractionBar';
import Comments from '@/components/Comments';

function PostSection({ data }) {
  return (
    <section className='container mx-auto md:pt-8 pb-4'>
      <div className='items-center justify-center flex md:mt-5 h-70 md:h-150 w-full relative '>
        <img src={data.image} alt="" className='object-cover absolute w-full h-full md:rounded-3xl' />
      </div>
      <main className='flex flex-col md:flex-row mt-5 md:mt-12'>
        <div className='flex w-full md:w-2/3 flex-col p-4'>
          <div className='flex gap-4 items-center mb-4'>
            <span className="text-sm text-green-600 bg-green-100 inline-block py-1 px-4 rounded-full md:text-sm lg:text-base">
              {data.category}
            </span>
            <span className="text-gray-500 text-sm">{data.date}</span>
          </div>
          <h2 className="md:text-5xl text-3xl font-bold mb-8">{data.title}</h2>
          <ReactMarkdown
            components={{
              h2: (props) => <h1 className='mb-2 font-semibold text-xl md:text-2xl' {...props} />,
              p: (props) => <p className='mb-5' {...props} />
            }}
          >
            {data.content}
          </ReactMarkdown>
          <div className='flex md:hidden'>
            <AuthorCard name={data.author} />
          </div>

          <InteractionBar />
          <Comments />
        </div>
        <div className=' md:w-1/3 p-4 justify-center hidden md:flex'>
          <AuthorCard name={data.author} />
        </div>
      </main>
    </section>
  );
}

export default PostSection;