'use client';

import React, { useState, useEffect } from 'react';
import { Story } from 'shared';
import StoryCard from './StoryCard';

interface StoryGridProps {
  stories: Story[];
  isLoading?: boolean;
  error?: string | null;
  onStoryClick?: (story: Story) => void;
  showAuthor?: boolean;
  showStats?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

const StoryGrid: React.FC<StoryGridProps> = ({
  stories,
  isLoading = false,
  error = null,
  onStoryClick,
  showAuthor = true,
  showStats = true,
  emptyMessage = 'No stories found',
  emptyDescription = 'Try adjusting your search or filters to find more stories.',
  className = '',
  columns = 3,
  showLoadMore = false,
  onLoadMore,
  isLoadingMore = false,
  hasMore = false,
}) => {
  const [visibleStories, setVisibleStories] = useState<Story[]>([]);
  const [animationDelay, setAnimationDelay] = useState(0);

  useEffect(() => {
    if (stories.length > 0) {
      // Stagger the animation of story cards
      setVisibleStories([]);
      stories.forEach((story, index) => {
        setTimeout(() => {
          setVisibleStories(prev => [...prev, story]);
        }, index * 50); // 50ms delay between each card
      });
    }
  }, [stories]);

  const getGridColumns = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  const SkeletonCard = () => (
    <div
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-pulse"
      data-oid="9--:-ze"
    >
      {/* Cover Image Skeleton */}
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300" data-oid="uqrc.ho"></div>

      {/* Content Skeleton */}
      <div className="p-5" data-oid="tooyezf">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded mb-2" data-oid="wawfrq0"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" data-oid="1t3sqq3"></div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4" data-oid="24bvp9a">
          <div className="h-3 bg-gray-200 rounded" data-oid="aeyi_l:"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6" data-oid="b7li1ap"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6" data-oid=".mi2n6j"></div>
        </div>

        {/* Genres Skeleton */}
        <div className="flex gap-1 mb-4" data-oid="99vwyzs">
          <div className="h-6 bg-gray-200 rounded-md w-16" data-oid="9p.6iys"></div>
          <div className="h-6 bg-gray-200 rounded-md w-20" data-oid="e7v.033"></div>
          <div className="h-6 bg-gray-200 rounded-md w-14" data-oid="4m2u8ff"></div>
        </div>

        {/* Author Skeleton */}
        {showAuthor && (
          <div className="flex items-center mb-3" data-oid=":ptt_xl">
            <div className="h-6 w-6 bg-gray-200 rounded-full" data-oid="cx79gq0"></div>
            <div className="ml-2 h-4 bg-gray-200 rounded w-24" data-oid="6cji4bx"></div>
          </div>
        )}

        {/* Stats Skeleton */}
        <div className="flex justify-between items-center mb-4" data-oid="c.pj2oy">
          <div className="flex space-x-4" data-oid="ynvoyu6">
            <div className="h-3 bg-gray-200 rounded w-12" data-oid=".z7r_dc"></div>
            <div className="h-3 bg-gray-200 rounded w-12" data-oid="j2a3q.s"></div>
            <div className="h-3 bg-gray-200 rounded w-16" data-oid="zdr.560"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-16" data-oid="546qzgm"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-10 bg-gray-200 rounded-lg" data-oid=".9vnfmy"></div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div
      className="col-span-full flex flex-col items-center justify-center py-16 px-4"
      data-oid="znytcyr"
    >
      <div className="text-center max-w-md" data-oid="4-6108u">
        {/* Empty State Icon */}
        <div className="mx-auto h-24 w-24 text-gray-300 mb-6" data-oid="6ryjqow">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="h-full w-full"
            data-oid="ikt8mcp"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              data-oid="yap0wco"
            />
          </svg>
        </div>

        {/* Empty State Text */}
        <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="_hr:zo5">
          {emptyMessage}
        </h3>
        <p className="text-gray-500 mb-6" data-oid="rrvj.g2">
          {emptyDescription}
        </p>

        {/* Empty State Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center" data-oid="rcgro94">
          <button
            onClick={() => (window.location.href = '/explore')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            data-oid="i:eul6w"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="8dzdai2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                data-oid="mhseo67"
              />
            </svg>
            Explore Stories
          </button>
          <button
            onClick={() => (window.location.href = '/create')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            data-oid="jkdu5nm"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="8osnk7j"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
                data-oid=".ndnixg"
              />
            </svg>
            Create Story
          </button>
        </div>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div
      className="col-span-full flex flex-col items-center justify-center py-16 px-4"
      data-oid="guaa__k"
    >
      <div className="text-center max-w-md" data-oid="x2bep6j">
        {/* Error Icon */}
        <div className="mx-auto h-16 w-16 text-red-400 mb-6" data-oid="m-2x__t">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            className="h-full w-full"
            data-oid="phcnmi_"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
              data-oid="dfxhr75"
            />
          </svg>
        </div>

        {/* Error Text */}
        <h3 className="text-lg font-medium text-gray-900 mb-2" data-oid="r2qbz33">
          Something went wrong
        </h3>
        <p className="text-gray-500 mb-6" data-oid="_mn_v7s">
          {error || "We couldn't load the stories. Please try again."}
        </p>

        {/* Error Actions */}
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          data-oid="nv4n1-5"
        >
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-oid="ph6z35i"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              data-oid="u537le:"
            />
          </svg>
          Try Again
        </button>
      </div>
    </div>
  );

  const LoadMoreButton = () => (
    <div className="col-span-full flex justify-center py-8" data-oid="7yb23:l">
      <button
        onClick={onLoadMore}
        disabled={isLoadingMore || !hasMore}
        className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
        data-oid=".y5zr9v"
      >
        {isLoadingMore ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              data-oid="ihey1t."
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                data-oid="drym:lq"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                data-oid="t0gea_p"
              ></path>
            </svg>
            Loading...
          </>
        ) : hasMore ? (
          <>
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="xc3y_8f"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
                data-oid="d0a0paa"
              />
            </svg>
            Load More Stories
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="eg.6aw7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
                data-oid="g3mzmu."
              />
            </svg>
            All Stories Loaded
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className={`w-full ${className}`} data-oid="va9gfmk">
      {/* Grid Container */}
      <div className={`grid ${getGridColumns()} gap-6`} data-oid="mraw38f">
        {/* Error State */}
        {error && <ErrorState data-oid="tk6-.7_" />}

        {/* Loading State */}
        {isLoading &&
          !error &&
          Array.from({ length: columns * 2 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} data-oid="9is08mo" />
          ))}

        {/* Empty State */}
        {!isLoading && !error && stories.length === 0 && <EmptyState data-oid="g4u_sab" />}

        {/* Story Cards */}
        {!isLoading &&
          !error &&
          visibleStories.map((story, index) => (
            <div
              key={story.id}
              className="transform transition-all duration-300 hover:scale-[1.02]"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards',
              }}
              data-oid="s76hsoy"
            >
              <StoryCard
                story={story}
                onClick={onStoryClick}
                showAuthor={showAuthor}
                showStats={showStats}
                data-oid="yy30x-q"
              />
            </div>
          ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && !isLoading && !error && stories.length > 0 && (
        <LoadMoreButton data-oid="z_rn9f." />
      )}

      {/* CSS for animations */}
      <style jsx data-oid="rq8.hce">{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StoryGrid;
