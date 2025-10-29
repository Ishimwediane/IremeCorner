// components/Community.jsx or pages/community.jsx
'use client';
import { useState, useEffect } from 'react';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [comments, setComments] = useState({});

  // Sample initial data
  useEffect(() => {
    const initialPosts = [
      {
        id: 1,
        title: "Welcome to our Community!",
        content: "This is a space for buyers, trainers, learners, and viewers to share ideas and help each other.",
        author: "Admin",
        date: "2024-01-15",
        category: "announcement"
      }
    ];
    setPosts(initialPosts);
  }, []);

  const createPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post = {
      id: posts.length + 1,
      title: newPost.substring(0, 50) + (newPost.length > 50 ? '...' : ''),
      content: newPost,
      author: "Current User", // Replace with actual user
      date: new Date().toISOString().split('T')[0],
      category: "discussion"
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;

    const comment = {
      id: Date.now(),
      postId,
      text: commentText,
      author: "Current User", // Replace with actual user
      date: new Date().toLocaleString()
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Forum</h1>
        <p className="text-lg text-gray-600">
          Connect with buyers, trainers, learners, and viewers. Share ideas, ask questions, and help each other grow.
        </p>
      </div>

      {/* Create Post Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
        <form onSubmit={createPost}>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts, ask questions, or start a discussion..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
          />
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Post to Community
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
            {/* Post Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  By {post.author} • {post.date} • <span className="capitalize">{post.category}</span>
                </p>
              </div>
            </div>

            {/* Post Content */}
            <div className="text-gray-700 mb-4">
              {post.content}
            </div>

            {/* Comments Section */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Comments ({comments[post.id]?.length || 0})</h4>
              
              {/* Add Comment */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      addComment(post.id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {(comments[post.id] || []).map(comment => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;