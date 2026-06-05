export type Artist = {
  id: string;
  name: string;
  country: string;
  birthYear: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Album = {
  id: string;
  title: string;
  releaseYear: number;
  genre: string;
  artistId: string;
  isStudio: boolean;
  createdAt: string;
  updatedAt: string;
};