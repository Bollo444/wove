'use client';

import React, { useState } from 'react';
import { Story, AgeTier } from 'shared';

interface StoryCardProps {
  story: Story;
  onClick?: (story: Story) => void;
  showAuthor?: boolean;
  showStats?: boolean;
  className?: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ 
  story, 
  onClick, 
  showAuthor = true, 
  showStats = true, 
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(story);
    } else {
      // Default navigation to story page
      window.location.href = `/story/${story.id}`;
    }
  };

  const getAgeTierColor = (ageTier: AgeTier): string => {
    switch (ageTier) {
      case AgeTier.KIDS:
        return 'bg-green-100 text-green-800 border-green-200';
      case AgeTier.TEENS_U16:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case AgeTier.TEENS_16_PLUS:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case AgeTier.ADULTS:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAgeTierLabel = (ageTier: AgeTier): string => {
    switch (ageTier) {
      case AgeTier.KIDS:
        return 'Kids (6-12)';
      case AgeTier.TEENS_U16:
        return 'Teens (13-15)';
      case AgeTier.TEENS_16_PLUS:
        return 'Teens (16-17)';
      case AgeTier.ADULTS:
        return 'Adults (18+)';
      default:
        return 'All Ages';
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 overflow-hidden ${className}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 overflow-hidden">
        {story.coverImageUrl && !imageError ? (
          <img
            src={story.coverImageUrl}
            alt={`Cover for ${story.title}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-sm font-medium opacity-90">{story.title}</p>
            </div>
          </div>
        )}
        
        {/* Overlay with quick actions */}
        <div className={`absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex space-x-2">
            <button 
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                // Add to favorites logic
              }}
              title="Add to favorites"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button 
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                // Share story logic
              }}
              title="Share story"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Age Tier Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getAgeTierColor(story.ageTier)}`}>
            {getAgeTierLabel(story.ageTier)}
          </span>
        </div>
        
        {/* Privacy Badge */}
        {!story.isPublic && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
              <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Private
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
          {story.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {truncateText(story.description || 'No description available.', 120)}
        </p>
        
        {/* Genres */}
        {story.genres && story.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {story.genres.slice(0, 3).map((genre, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"
              >
                {genre}
              </span>
            ))}
            {story.genres.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                +{story.genres.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Author */}
        {showAuthor && story.author && (
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              {story.author.profilePictureUrl ? (
                <img 
                  src={story.author.profilePictureUrl} 
                  alt={`${story.author.firstName} ${story.author.lastName}`}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-purple-600">
                    {story.author.firstName?.[0]}{story.author.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-2 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">
                {story.author.firstName} {story.author.lastName}
              </p>
            </div>
          </div>
        )}
        
        {/* Stats and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            {showStats && (
              <>
                {/* Views */}
                <div className="flex items-center">
                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{formatNumber(story.viewCount || 0)}</span>
                </div>
                
                {/* Likes */}
                <div className="flex items-center">
                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{formatNumber(story.likeCount || 0)}</span>
                </div>
                
                {/* Segments */}
                <div className="flex items-center">
                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{story.segments?.length || 0} parts</span>
                </div>
              </>
            )}
          </div>
          
          {/* Creation Date */}
          <div className="flex items-center">
            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(story.createdAt)}</span>
          </div>
        </div>
        
        {/* Progress Bar (if story has been started) */}
        {story.userProgress && story.userProgress > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(story.userProgress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${story.userProgress * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Action Footer */}
      <div className="px-5 pb-4">
        <button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          {story.userProgress && story.userProgress > 0 ? (
            <>
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Continue Reading
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Start Reading
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StoryCard;
