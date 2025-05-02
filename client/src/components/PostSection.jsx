import React from 'react';
import AuthorCard from '@/components/ui/AuthorCard';
import Comments from '../components/Comments';
import InteractionBar from '../components/ui/InteractionBar';
import DOMPurify from 'dompurify';
import { formatDate } from '../utils/dateFormatter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const processMarkdown = (content) => {
  if (!content) return '';
  return content
    .replace(/\\n\\n/g, '\n\n')
    .replace(/\\n/g, '\n');
};

function PostSection({ data }) {
  if (!data) {
    return <div>No post data available</div>;
  }

  const postId = data.id;
  console.log("PostSection passing ID:", postId);

  const sanitizedContent = data.content ? DOMPurify.sanitize(data.content) : '';

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='mb-10 rounded-xl overflow-hidden w-full'>
        {data.banner_img || data.image ? (
          <img
            src={data.banner_img || data.image}
            alt={data.title}
            className='w-full h-[400px] object-cover'
          />
        ) : (
          <div className='h-[400px] bg-gray-200 flex items-center justify-center'>
            <p className='text-gray-500'>No image available</p>
          </div>
        )}
      </div>
      <div className='flex items-center gap-3 mb-4'>
        <div className='flex items-center flex-wrap gap-2'>
          <span className={`
            ${data.category ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'} 
            px-3 py-1 rounded-full text-sm font-medium
          `}>
            {data.category?.name || 'Uncategorized'}
          </span>
          <span className='text-gray-500 text-sm'>
            {formatDate(data.created_at) || 'No date available'}
          </span>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-10'>
        <main className='w-full md:w-2/3'>
          <h1 className='text-4xl md:text-5xl font-bold mb-8 text-gray-900'>
            {data.title}
          </h1>
          <div className='prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 mb-10'>
            {data.content_format === 'markdown' ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
              >
                {processMarkdown(data.content)}
              </ReactMarkdown>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            )}
          </div>
          {data.tags && data.tags.length > 0 && (
            <div className='mb-10'>
              <div className='flex flex-wrap gap-2'>
                {data.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className='bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700 cursor-pointer'
                  >
                    {tag.name || tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <InteractionBar postId={postId} />
          <div id="comments-section">
            <Comments postId={postId} />
          </div>
        </main>
        <aside className='w-full md:w-1/3'>
          <div className='md:sticky md:top-24'>
            <AuthorCard author={data.author} />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PostSection;
