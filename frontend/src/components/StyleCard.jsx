import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { Eye } from 'lucide-react';

const StyleCard = ({ style }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={style.image}
          alt={style.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            style.category === 'formal' ? 'bg-primary-100 text-primary-800' :
            style.category === 'sport' ? 'bg-green-100 text-green-800' :
            style.category === 'everyday' ? 'bg-blue-100 text-blue-800' :
            'bg-accent-100 text-accent-800'
          }`}>
            {style.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
          {style.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {style.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <StarRating rating={style.averageRating} readonly />
            <span className="text-sm text-gray-500">
              ({style.totalReviews} reviews)
            </span>
          </div>
        </div>

        <Link
          to={`/style/${style._id}`}
          className="inline-flex items-center space-x-2 w-full justify-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 font-medium"
        >
          <Eye className="w-4 h-4" />
          <span>View Details</span>
        </Link>
      </div>
    </div>
  );
};

export default StyleCard;