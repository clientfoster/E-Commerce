import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Eye, Tag, ArrowLeft, Share2 } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  views: number;
  created_at: string;
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

  useEffect(() => {
    if (slug) {
      loadBlog();
    }
  }, [slug]);

  const loadBlog = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/blog/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setBlog(data);
        loadRelatedBlogs(data.category);
      }
    } catch (error) {
      console.error('Error loading blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedBlogs = async (category: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/blog?category=${category}&limit=3`);
      if (response.ok) {
        const data = await response.json();
        setRelatedBlogs(data.filter((b: any) => b.slug !== slug));
      }
    } catch (error) {
      console.error('Error loading related blogs:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h2>
          <button
            onClick={() => navigate('/blog')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Blog
        </motion.button>

        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-2xl"
          />
        </motion.div>

        {/* Meta Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-4 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full">
              {blog.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              {blog.author.avatar ? (
                <img
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <span className="font-medium">{blog.author.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(blog.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>

            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {blog.views} views
            </div>
          </div>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <div
            className="text-gray-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.div>

        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border-t border-gray-200 pt-8 mb-12"
        >
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
            <Share2 className="w-5 h-5" />
            Share this article
          </button>
        </motion.div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border-t border-gray-200 pt-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog.id}
                  onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
                  className="cursor-pointer group"
                >
                  <img
                    src={relatedBlog.cover_image}
                    alt={relatedBlog.title}
                    className="w-full h-48 object-cover rounded-xl mb-4 group-hover:opacity-80 transition-opacity"
                  />
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 mb-2">
                    {relatedBlog.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{relatedBlog.excerpt}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
