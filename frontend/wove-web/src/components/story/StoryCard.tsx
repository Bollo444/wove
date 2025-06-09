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
  className = '',
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
      day: 'numeric',
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
      data-oid="np7y90h"
    >
      {/* Cover Image */}
      <div
        className="relative h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 overflow-hidden"
        data-oid="cmaxtf."
      >
        {story.coverImageUrl && !imageError ? (
          <img
            src={story.coverImageUrl}
            alt={`Cover for ${story.title}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImageError(true)}
            data-oid="mc.m9pi"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white"
            data-oid="qb7b_:g"
          >
            <div className="text-center" data-oid="xurwxn8">
              <svg
                className="mx-auto h-12 w-12 mb-2 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="7cetji1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  data-oid="6wtrnbh"
                />
              </svg>
              <p className="text-sm font-medium opacity-90" data-oid="mih_8p7">
                {story.title}
              </p>
            </div>
          </div>
        )}

        {/* Overlay with quick actions */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          data-oid="69jse2g"
        >
          <div className="flex space-x-2" data-oid="utwy7vb">
            <button
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
              onClick={e => {
                e.stopPropagation();
                // Add to favorites logic
              }}
              title="Add to favorites"
              data-oid="md9434t"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="s388sd0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  data-oid="nivbaa-"
                />
              </svg>
            </button>
            <button
              className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
              onClick={e => {
                e.stopPropagation();
                // Share story logic
              }}
              title="Share story"
              data-oid=":.9or9l"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid=".sd5p2f"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  data-oid=":wxp6de"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Age Tier Badge */}
        <div className="absolute top-3 left-3" data-oid="p0vbh.4">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getAgeTierColor(story.ageTier)}`}
            data-oid="ixx50ah"
          >
            {getAgeTierLabel(story.ageTier)}
          </span>
        </div>

        {/* Privacy Badge */}
        {!story.isPublic && (
          <div className="absolute top-3 right-3" data-oid="txpf.sy">
            <span
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"
              data-oid=":c9cwv2"
            >
              <svg
                className="h-3 w-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="m4qm19t"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  data-oid="5f5l.dc"
                />
              </svg>
              Private
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5" data-oid="-w4bk27">
        {/* Title */}
        <h3
          className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors"
          data-oid="g-02rvu"
        >
          {story.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed" data-oid="jd1wmz_">
          {truncateText(story.description || 'No description available.', 120)}
        </p>

        {/* Genres */}
        {story.genres && story.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4" data-oid="fah-l15">
            {story.genres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"
                data-oid="6icm65d"
              >
                {genre}
              </span>
            ))}
            {story.genres.length > 3 && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100"
                data-oid="um1r3f7"
              >
                +{story.genres.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Author */}
        {showAuthor && story.author && (
          <div className="flex items-center mb-3" data-oid="xgb1ku6">
            <div className="flex-shrink-0" data-oid="7ic66.g">
              {story.author.profilePictureUrl ? (
                <img
                  src={story.author.profilePictureUrl}
                  alt={`${story.author.firstName} ${story.author.lastName}`}
                  className="h-6 w-6 rounded-full object-cover"
                  data-oid="72xn:k5"
                />
              ) : (
                <div
                  className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center"
                  data-oid="1jv95s4"
                >
                  <span className="text-xs font-medium text-purple-600" data-oid="dcb2fbr">
                    {story.author.firstName?.[0]}
                    {story.author.lastName?.[0]}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-2 min-w-0 flex-1" data-oid="dbuhm7n">
              <p className="text-sm font-medium text-gray-700 truncate" data-oid="eq1lvtc">
                {story.author.firstName} {story.author.lastName}
              </p>
            </div>
          </div>
        )}

        {/* Stats and Date */}
        <div className="flex items-center justify-between text-xs text-gray-500" data-oid="54wshuw">
          <div className="flex items-center space-x-4" data-oid=":i2imst">
            {showStats && (
              <>
                {/* Views */}
                <div className="flex items-center" data-oid="3wx0.1.">
                  <svg
                    className="h-3 w-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="vybg7d3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      data-oid="9fjv2uo"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      data-oid="px7a3-c"
                    />
                  </svg>
                  <span data-oid=":g2j1r8">{formatNumber(story.viewCount || 0)}</span>
                </div>

                {/* Likes */}
                <div className="flex items-center" data-oid="q6b0_mg">
                  <svg
                    className="h-3 w-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="q85ieae"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      data-oid="tycg3ri"
                    />
                  </svg>
                  <span data-oid="n5bdzib">{formatNumber(story.likeCount || 0)}</span>
                </div>

                {/* Segments */}
                <div className="flex items-center" data-oid="0q6-snk">
                  <svg
                    className="h-3 w-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    data-oid="jsgcypy"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      data-oid="46fe8l."
                    />
                  </svg>
                  <span data-oid="qpw5ozi">{story.segments?.length || 0} parts</span>
                </div>
              </>
            )}
          </div>

          {/* Creation Date */}
          <div className="flex items-center" data-oid="h71vjpl">
            <svg
              className="h-3 w-3 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="pier6le"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                data-oid="nr1i88g"
              />
            </svg>
            <span data-oid="qtmwhr4">{formatDate(story.createdAt)}</span>
          </div>
        </div>

        {/* Progress Bar (if story has been started) */}
        {story.userProgress && story.userProgress > 0 && (
          <div className="mt-3" data-oid="zefx9n8">
            <div
              className="flex items-center justify-between text-xs text-gray-500 mb-1"
              data-oid="eokziuh"
            >
              <span data-oid="5ig.ffq">Progress</span>
              <span data-oid="0y1znso">{Math.round(story.userProgress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5" data-oid="ir99pin">
              <div
                className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${story.userProgress * 100}%` }}
                data-oid="wvrpwbj"
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-4" data-oid="icc4t77">
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          onClick={e => {
            e.stopPropagation();
            handleClick();
          }}
          data-oid="l9h6qa_"
        >
          {story.userProgress && story.userProgress > 0 ? (
            <>
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="sy304w7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  data-oid=":tuf26x"
                />
              </svg>
              Continue Reading
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="26lvg0g"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  data-oid="gkts7-p"
                />
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
