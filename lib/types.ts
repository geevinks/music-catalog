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
  coverPath: string | null;
  isStudio: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Track = {
  id: string;
  title: string;
  albumId: string;
  audioPath: string;
  createdAt: string;
  updatedAt: string;
};