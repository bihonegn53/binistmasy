import React, { useState } from 'react';
import { MessageSquare, Send, Star, User, Trash2 } from 'lucide-react';

export default function CommentPage() {
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  
  // Sample initial comments
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Sarah Connor',
      date: '2 hours ago',
      rating: 5,
      text: 'The dashboard UI is very responsive! Really enjoying the dark mode layout.',
    },
    {
      id: 2,
      name: 'Alex Johnson',
      date: '1 day ago',
      rating: 4,
      text: 'Great work on the employee tab. It would be awesome to add an export to PDF feature next.',
    },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      name: 'Current User', // You can replace with logged-in user data
      date: 'Just now',
      rating: rating,
      text: commentText,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    setRating(5);
  };

  const handleDelete = (id) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-10 font-sans">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <MessageSquare className="text-indigo-400 h-8 w-8" />
          Comments & Feedback
        </h1>
        <p className="text-slate-400 mt-1">
          Leave your thoughts, suggestions, or feedback to help us improve.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Comment Form */}
        <div className="lg:col-span-1 bg-[#1e293b] border border-slate-700/60 rounded-xl p-6 shadow-lg h-fit">
          <h2 className="text-xl font-semibold mb-4 text-white">Leave a Comment</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-slate-300 mb-1">
                Your Message
              </label>
              <textarea
                id="comment"
                rows={5}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your feedback or comment here..."
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition shadow-md"
            >
              <Send className="h-4 w-4" />
              Post Comment
            </button>
          </form>
        </div>

        {/* Right Column: Recent Comments List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Comments ({comments.length})</h2>

          {comments.length === 0 ? (
            <div className="bg-[#1e293b] border border-slate-700/60 rounded-xl p-8 text-center text-slate-400">
              No comments yet. Be the first to leave one!
            </div>
          ) : (
            comments.map((item) => (
              <div
                key={item.id}
                className="bg-[#1e293b] border border-slate-700/60 rounded-xl p-5 shadow-sm space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base">{item.name}</h3>
                      <p className="text-xs text-slate-400">{item.date}</p>
                    </div>
                  </div>

                  {/* Rating display & Delete button */}
                  <div className="flex items-center gap-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= item.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-500 hover:text-red-400 transition"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed pl-11">
                  {item.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}