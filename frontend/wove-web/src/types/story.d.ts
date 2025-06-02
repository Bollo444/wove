export interface Premise {
  premiseId: string;
  title: string;
  description: string;
  coverArtUrl?: string;
  genre: string[]; // API doc shows singular genre, but premises might have multiple. Adjust if needed.
  theme: string[]; // API doc doesn't explicitly list themes for premise, but implies with filter. Assume array.
  ageTier: string; // e.g., 'kids', 'teens', 'adults' (align with AgeTier enum values)
  openingMusicThemePreviewUrl?: string; // From API doc
  // Add any other fields from GET /stories/premises response if necessary
}

// You might also want to define types for Genres and Themes if they are fetched from an API later
// export interface Genre {
//   id: string;
//   name: string;
// }

// export interface Theme {
//   id: string;
//   name: string;
// }
