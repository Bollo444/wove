'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import StoryGrid from '../../components/story/StoryGrid';
import { useStory } from '../../contexts/StoryContext';
import { useAuth } from '../../contexts/AuthContext';

const ExplorePage: React.FC = () => {
  const { stories, isLoading, loadPublicStories } = useStory();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    genre: '',
    ageTier: '',
    sortBy: 'popularity',
  });

  useEffect(() => {
    const loadStories = async () => {
      setError(null);
      try {
        await loadPublicStories(filters);
      } catch (err: any) {
        setError(err.message || 'Failed to load stories.');
      }
    };

    loadStories();
  }, [filters, loadPublicStories]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    console.log('Filters updated (placeholder):', { ...filters, [e.target.name]: e.target.value });
    // In a real app, this might trigger a re-fetch or client-side filtering
  };

  return (
    <Layout title="Explore Stories - Wove">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Explore Interactive Stories
        </h1>

        {/* Placeholder for Filter UI */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Filter & Sort</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="searchTerm"
              placeholder="Search by title or author..."
              value={filters.searchTerm}
              onChange={handleFilterChange}
              className="input-field"
            />
            <select
              name="genre"
              value={filters.genre}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Genres</option>
              <option value="fantasy">Fantasy</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="mystery">Mystery</option>
              {/* Add more genres */}
            </select>
            <select
              name="ageTier"
              value={filters.ageTier}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">All Age Tiers</option>
              <option value="KIDS">Kids</option>
              <option value="TEENS_U16">Teens (U16)</option>
              <option value="TEENS_16_PLUS">Teens (16+)</option>
              <option value="ADULTS">Adults</option>
            </select>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="popularity">Popularity</option>
              <option value="recent">Most Recent</option>
              <option value="title_asc">Title (A-Z)</option>
              <option value="title_desc">Title (Z-A)</option>
            </select>
          </div>
        </div>

        <StoryGrid stories={stories} isLoading={isLoading} error={error} />

        {/* Placeholder for Pagination */}
        {/* <div className="mt-8 text-center">
          <button className="btn-secondary mx-1">Previous</button>
          <span className="mx-2">Page 1 of X</span>
          <button className="btn-secondary mx-1">Next</button>
        </div> */}
      </div>
    </Layout>
  );
};

export default ExplorePage;
