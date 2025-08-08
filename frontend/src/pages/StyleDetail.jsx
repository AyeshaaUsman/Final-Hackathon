import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import api from '../services/api';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const StyleDetail = () => {
  const { id } = useParams();
  const [style, setStyle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStyleAndReviews();
  }, [id]);

  const fetchStyleAndReviews = async () => {
    try {
      const [styleResponse, reviewsResponse] = await Promise.all([
        api.get(`/styles/${id}`),
        api.get(`/reviews/style/${id}`)
      ]);

      setStyle(styleResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews([newReview, ...reviews]);
    // Refresh style data to get updated ratings
    fetchStyleAndReviews();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading style details...</p>
        </div>
      </div>
    );
  }

  if (!style) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Style not found</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Styles</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Style Image */}
        <div className="relative">
          <img
            src={style.image}
            alt={style.name}
            className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
          />
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              style.category === 'formal' ? 'bg-primary-100 text-primary-800' :
              style.category === 'sport' ? 'bg-green-100 text-green-800' :
              style.category === 'everyday' ? 'bg-blue-100 text-blue-800' :
              'bg-accent-100 text-accent-800'
            }`}>
              {style.category}
            </span>
          </div>
        </div>

        {/* Style Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{style.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{style.description}</p>
          </div>

          <div className="flex items-center space-x-4">
            <StarRating rating={style.averageRating} readonly />
            <span className="text-sm text-gray-500">
              {style.averageRating.toFixed(1)} ({style.totalReviews} reviews)
            </span>
          </div>

          {/* Review Form */}
          <ReviewForm styleId={id} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No reviews yet. Be the first to review this style!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{review.user.username}</h4>
                      <div className="flex items-center space-x-2">
                        <StarRating rating={review.rating} readonly />
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleDetail;