'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/layout/Layout';
import StoryGrid from '../../components/story/StoryGrid';
import { useStory } from '../../contexts/StoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { AgeTier } from 'shared';

const availableGenres = [
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'sci-fi', name: 'Sci-Fi' },
  { id: 'mystery', name: 'Mystery' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'humor', name: 'Humor' },
  { id: 'historical', name: 'Historical Fiction' },
];

const ExplorePage: React.FC = () => {
  const { stories, isLoading, loadPublicStories, searchStories } = useStory();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    genre: '',
    ageTier: '',
    sortBy: 'popularity',
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const loadStories = useCallback(async (currentFilters: typeof filters) => {
    setError(null);
    try {
      if (currentFilters.searchTerm.trim()) {
        setIsSearching(true);
        await searchStories(currentFilters.searchTerm, {
          genre: currentFilters.genre,
          ageTier: currentFilters.ageTier,
          sortBy: currentFilters.sortBy,
        });
      } else {
        await loadPublicStories({
          genre: currentFilters.genre,
          ageTier: currentFilters.ageTier,
          sortBy: currentFilters.sortBy,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load stories.');
    } finally {
      setIsSearching(false);
    }
  }, [loadPublicStories, searchStories]);

  useEffect(() => {
    loadStories(filters);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    
    // Debounce search for search term
    if (e.target.name === 'searchTerm') {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      const timeout = setTimeout(() => {
        loadStories(newFilters);
      }, 500); // 500ms debounce
      
      setSearchTimeout(timeout);
    } else {
      // Immediate filter for other options
      loadStories(newFilters);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      genre: '',
      ageTier: '',
      sortBy: 'popularity',
    };
    setFilters(clearedFilters);
    loadStories(clearedFilters);
  };

  const hasActiveFilters = filters.searchTerm || filters.genre || filters.ageTier || filters.sortBy !== 'popularity';

  return (
    <Layout title="Explore Stories - Wove">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Discover Amazing Stories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore interactive stories created by our community of storytellers
          </p>
        </div>

        {/* Enhanced Filter UI */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 lg:mb-0">
              Find Your Perfect Story
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All Filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-2">
                Search Stories
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="searchTerm"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  placeholder="Search by title, description, or author..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {isSearching && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Genre Filter */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                id="genre"
                name="genre"
                value={filters.genre}
                onChange={handleFilterChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">All Genres</option>
                {availableGenres.map(genre => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Age Tier Filter */}
            <div>
              <label htmlFor="ageTier" className="block text-sm font-medium text-gray-700 mb-2">
                Age Group
              </label>
              <select
                id="ageTier"
                name="ageTier"
                value={filters.ageTier}
                onChange={handleFilterChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">All Ages</option>
                <option value={AgeTier.KIDS}>Kids (6-12)</option>
                <option value={AgeTier.TEENS_U16}>Young Teens (13-15)</option>
                <option value={AgeTier.TEENS_16_PLUS}>Older Teens (16-17)</option>
                <option value={AgeTier.ADULTS}>Adults (18+)</option>
              </select>
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'popularity', label: 'Most Popular' },
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'title', label: 'Title A-Z' },
                { value: 'author', label: 'Author A-Z' },
              ].map(option => (
                <label
                  key={option.value}
                  className={`flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                    filters.sortBy === option.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={handleFilterChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-600">
            {isLoading ? (
              <span>Loading stories...</span>
            ) : (
              <span>
                {stories.length} {stories.length === 1 ? 'story' : 'stories'} found
                {filters.searchTerm && (
                  <span> for "{filters.searchTerm}"</span>
                )}
              </span>
            )}
          </div>
          
          {user && (
            <div className="text-sm">
              <span className="text-gray-500 mr-2">Want to share your story?</span>
              <a
                href="/create"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Create Story →
              </a>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠</span>
              {error}
            </div>
          </div>
        )}

        {/* Stories Grid */}
        <StoryGrid stories={stories} isLoading={isLoading} error={error} />
        
        {/* Empty State */}
        {!isLoading && !error && stories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {hasActiveFilters ? 'No stories match your filters' : 'No stories available yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria or clearing filters'
                : 'Be the first to create and share a story with the community!'
              }
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Clear Filters
              </button>
            ) : user ? (
              <a
                href="/create"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-block"
              >
                Create Your First Story
              </a>
            ) : (
              <a
                href="/register"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-block"
              >
                Join Wove to Create Stories
              </a>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExplorePage;
