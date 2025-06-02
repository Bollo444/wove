'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../../components/layout/Layout';
import StoryGrid from '../../components/story/StoryGrid';
import { useStory } from '../../contexts/StoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { Premise } from '../../types/story.d'; // Import Premise type
import { AgeTier } from '@shared/types/age-tier'; // For age tier enum values

// Hardcoded filter options
const availableGenres = ['Fantasy', 'Sci-Fi', 'Mystery', 'Adventure', 'Slice of Life'];
const availableThemes = ['Friendship', 'Discovery', 'Conflict', 'Humor'];
const ageTierOptions = [
  { value: '', label: 'All Age Tiers' },
  { value: AgeTier.KIDS, label: 'Kids' },
  { value: AgeTier.TEENS, label: 'Teens' },
  { value: AgeTier.ADULTS, label: 'Adults' },
];


const ExplorePage: React.FC = () => {
  const { premises, isLoading, loadPublicStories } = useStory();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    genre: '', // Single select for genre
    theme: '', // Single select for theme
    ageTier: '', // User's effective age tier for API, or selected for client filter
    sortBy: 'popularity', // API might handle this, or client-side
  });

  // Determine available age tiers for filtering based on user's verified age
  const userAgeTier = user?.ageTier;
  const selectableAgeTiers = useMemo(() => {
    if (!userAgeTier || userAgeTier === AgeTier.ADULTS) {
      return ageTierOptions; // Adults can see all
    }
    if (userAgeTier === AgeTier.TEENS) {
      return ageTierOptions.filter(option => option.value === '' || option.value === AgeTier.TEENS || option.value === AgeTier.KIDS);
    }
    if (userAgeTier === AgeTier.KIDS) {
      return ageTierOptions.filter(option => option.value === '' || option.value === AgeTier.KIDS);
    }
    return ageTierOptions.filter(option => option.value === ''); // Default to "All" if unverified or unknown
  }, [userAgeTier]);

  useEffect(() => {
    // Set initial ageTier filter based on user's verified age if not already set by user
    if (user?.isAgeVerified && !filters.ageTier) {
        // Backend handles filtering by user's age tier by default if no specific ageTier filter is sent.
        // This client-side filter is for user's explicit choice.
        // setFilters(prev => ({ ...prev, ageTier: user.ageTier }));
    }
    
    const loadData = async () => {
      setError(null);
      try {
        // Pass API-compatible filters. Client-side filtering will refine this.
        const apiFilters = {
            genre: filters.genre || undefined, // Send undefined if empty to not filter by it
            theme: filters.theme || undefined,
            // ageTier: filters.ageTier || user?.ageTier || undefined, // API uses user's verified age by default
            // sortBy: filters.sortBy (API doc does not list sortBy for premises, but good for future)
        };
        await loadPublicStories(apiFilters);
      } catch (err: any) {
        setError(err.message || 'Failed to load story premises.');
      }
    };

    loadData();
  }, [loadPublicStories, user, filters.genre, filters.theme]); // Removed filters.ageTier from deps for now to avoid loop with default setting

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const filteredPremises = useMemo(() => {
    return premises.filter((premise: Premise) => {
      const searchTermMatch = !filters.searchTerm || premise.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || premise.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const genreMatch = !filters.genre || (premise.genre && premise.genre.includes(filters.genre));
      const themeMatch = !filters.theme || (premise.theme && premise.theme.includes(filters.theme));
      const ageTierMatch = !filters.ageTier || premise.ageTier === filters.ageTier;
      
      // Further restrict by user's age tier if they are not an adult
      let userAgeRestrictionMatch = true;
      if (user && user.isAgeVerified) {
        if (user.ageTier === AgeTier.TEENS && premise.ageTier === AgeTier.ADULTS) {
          userAgeRestrictionMatch = false;
        } else if (user.ageTier === AgeTier.KIDS && (premise.ageTier === AgeTier.ADULTS || premise.ageTier === AgeTier.TEENS)) {
          userAgeRestrictionMatch = false;
        }
      } else if (user && !user.isAgeVerified) { 
        // Unverified users might only see 'all ages' or 'unverified' premises depending on policy
        // For now, let's assume they can see KIDS/TEENS but not ADULTS - this needs clarification
        if (premise.ageTier === AgeTier.ADULTS) userAgeRestrictionMatch = false;
      }


      return searchTermMatch && genreMatch && themeMatch && ageTierMatch && userAgeRestrictionMatch;
    });
    // Add sorting logic here if filters.sortBy is to be handled client-side
    // .sort((a, b) => {...})
  }, [premises, filters, user]);


  return (
    <Layout title="Explore Story Premises - Wove">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Explore Story Premises
        </h1>

        <div className="mb-8 p-4 bg-gray-100 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Filter & Sort</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="searchTerm"
              placeholder="Search by title or description..."
              value={filters.searchTerm}
              onChange={handleFilterChange}
              className="input-field"
            />
            <select name="genre" value={filters.genre} onChange={handleFilterChange} className="input-field">
              <option value="">All Genres</option>
              {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select name="theme" value={filters.theme} onChange={handleFilterChange} className="input-field">
              <option value="">All Themes</option>
              {availableThemes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select name="ageTier" value={filters.ageTier} onChange={handleFilterChange} className="input-field">
              {selectableAgeTiers.map(tier => (
                <option key={tier.value} value={tier.value}>{tier.label}</option>
              ))}
            </select>
            {/* SortBy is not implemented in client-side filter yet, API also doesn't list it for premises */}
            {/* <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="input-field">
              <option value="popularity">Popularity</option>
              <option value="recent">Most Recent</option>
            </select> */}
          </div>
        </div>

        <StoryGrid premises={filteredPremises} isLoading={isLoading} error={error} />

        {/* Placeholder for Pagination - would need total count from API and offset/limit logic */}
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
