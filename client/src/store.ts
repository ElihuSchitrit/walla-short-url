// store.ts
import {create} from 'zustand'

type UrlEntry = {
  id: number;
  originalUrl: string;
  shortenedUrl: string;
  dateCreated: string;
  ip: string;
};

interface UrlState {
  urls: UrlEntry[];
  addUrl: (urlEntry: UrlEntry) => void;
}

const useUrlStore = create<UrlState>(set => ({
  urls: [],
  addUrl: (urlEntry: UrlEntry) => set(state => ({
    urls: [...state.urls, urlEntry]
  })),
}));

export default useUrlStore;
