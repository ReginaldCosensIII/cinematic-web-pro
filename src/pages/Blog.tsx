
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackground from '../components/SmokeBackground';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of React: Server Components and Beyond",
      excerpt: "Exploring the latest developments in React Server Components and how they're revolutionizing web development architecture.",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "React",
      featured: true
    },
    {
      id: 2,
      title: "Building Performant Web Apps with Next.js 14",
      excerpt: "A deep dive into Next.js 14's new features and how to leverage them for optimal performance and user experience.",
      date: "2024-01-08",
      readTime: "7 min read",
      category: "Next.js"
    },
    {
      id: 3,
      title: "CSS Grid vs Flexbox: When to Use Which",
      excerpt: "Understanding the key differences between CSS Grid and Flexbox, and making the right choice for your layout needs.",
      date: "2024-01-01",
      readTime: "4 min read",
      category: "CSS"
    },
    {
      id: 4,
      title: "TypeScript Best Practices for Large Applications",
      excerpt: "Essential TypeScript patterns and practices that will help you maintain scalable and type-safe codebases.",
      date: "2023-12-25",
      readTime: "6 min read",
      category: "TypeScript"
    },
    {
      id: 5,
      title: "Modern Web Development Workflow with Vite",
      excerpt: "How Vite is changing the development experience and why it's becoming the go-to build tool for modern web projects.",
      date: "2023-12-18",
      readTime: "5 min read",
      category: "Tools"
    }
  ];

  return (
    <div className="min-h-screen bg-webdev-black relative overflow-hidden">
      <SmokeBackground />
      <Header />
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center animate-fade-in-up mb-16">
            <h1 className="text-4xl md:text-5xl font-light text-webdev-silver tracking-wide mb-6">
              Development Blog
            </h1>
            <p className="text-webdev-soft-gray text-lg tracking-wide max-w-2xl mx-auto leading-relaxed">
              Stay updated with the latest trends, techniques, and insights from the world of web development.
            </p>
          </div>

          {/* Featured Post */}
          {blogPosts.filter(post => post.featured).map(post => (
            <div key={post.id} className="mb-16 animate-fade-in-up">
              <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple text-white text-sm font-medium rounded-full mb-4">
                  Featured
                </span>
                <h2 className="text-2xl md:text-3xl font-semibold text-webdev-silver mb-4 leading-tight">
                  {post.title}
                </h2>
                <p className="text-webdev-soft-gray text-lg mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center text-webdev-soft-gray text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center text-webdev-soft-gray text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {post.readTime}
                    </div>
                    <span className="px-2 py-1 bg-webdev-darker-gray text-webdev-silver text-xs rounded">
                      {post.category}
                    </span>
                  </div>
                  <button className="flex items-center text-webdev-gradient-blue hover:text-webdev-silver transition-colors">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="glass-effect rounded-2xl p-6 border border-webdev-glass-border hover:border-webdev-glass-border/50 transition-all duration-300 h-full flex flex-col">
                  <h3 className="text-xl font-semibold text-webdev-silver mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-webdev-soft-gray mb-4 leading-relaxed flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-webdev-glass-border">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-webdev-soft-gray text-sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center text-webdev-soft-gray text-sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-webdev-darker-gray text-webdev-soft-gray text-xs rounded">
                        {post.category}
                      </span>
                      <button className="text-webdev-gradient-blue hover:text-webdev-silver transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
