import { useState, useEffect, useCallback } from 'react';

const toPodcastStorageKey = (podcastId: string) => `podcast:${podcastId}`;
const toPodcastUpdatedAtStorageKey = (podcastId: string) =>
  `podcastUpdatedAt:${podcastId}`;

export interface Podcast {
  artistName: string;
  artworkUrl100: string;
  artworkUrl600?: string;
  collectionId: number;
  collectionName: string;
  description?: string;
  episodes: PodcastEpisode[];
}

export interface PodcastEpisode {
  description: string;
  duration: number;
  id: number;
  mediaContent: string;
  pubDate: string;
  title: string;
}

interface PodcastTrack {
  artistName: string;
  artworkUrl100: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl600: string;
  collectionCensoredName: string;
  collectionExplicitness: string;
  collectionHdPrice: number;
  collectionId: number;
  collectionName: string;
  collectionPrice: number;
  collectionViewUrl: string;
  contentAdvisoryRating: string;
  country: string;
  currency: string;
  feedUrl: string;
  genreIds: string[];
  genres: string[];
  kind: string;
  primaryGenreName: string;
  releaseDate: string;
  trackCensoredName: string;
  trackCount: number;
  trackExplicitness: string;
  trackId: number;
  trackName: string;
  trackPrice: number;
  trackTimeMillis: number;
  trackViewUrl: string;
  wrapperType: string;
}

interface PodcastEpisodeResponse {
  artistIds: string[];
  artworkUrl160: string | undefined;
  artworkUrl60: string | undefined;
  artworkUrl600: string | undefined;
  closedCaptioning: string;
  collectionId: number;
  collectionName: string;
  collectionViewUrl: string;
  contentAdvisoryRating: string;
  country: string;
  description: string;
  episodeContentType: string;
  episodeFileExtension: string;
  episodeGuid: string;
  episodeUrl: string;
  feedUrl: string;
  genres: [
    {
      name: string;
      id: string;
    },
  ];
  kind: string;
  previewUrl: string | undefined;
  releaseDate: string;
  shortDescription: string;
  trackId: number;
  trackName: string;
  trackTimeMillis: number | undefined;
  trackViewUrl: string;
  wrapperType: string;
}

interface PodcastResponse {
  resultCount: number;
  results: [PodcastTrack, ...PodcastEpisodeResponse[]];
}

interface Props {
  podcastId?: string;
}

const usePodcast = ({
  podcastId,
}: Props): {
  podcast: Podcast | null;
  loading: boolean | null;
} => {
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);

  const fetchPodcast = useCallback(async () => {
    if (!podcastId) return;
    // Check if podcasts are already stored in localStorage
    const storedPodcasts = localStorage.getItem(toPodcastStorageKey(podcastId));
    const storedDate = Number(
      localStorage.getItem(toPodcastUpdatedAtStorageKey(podcastId)),
    );
    // If the podcasts have already been stored and no more than one day has passed, retrieve them from localStorage.
    if (storedPodcasts && storedDate && Date.now() - storedDate < 86400000) {
      setPodcast(JSON.parse(storedPodcasts));
      setLoading(false);
      return;
    }
    setLoading(true);
    // Make request to get the updated list of podcasts.
    try {
      const encodedURL = encodeURIComponent(
        `https://itunes.apple.com/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`,
      );
      const resp = await fetch(
        `https://api.allorigins.win/raw?url=${encodedURL}`,
      );
      const podcastResponse: PodcastResponse = await resp.json();
      const { results } = podcastResponse;
      const track = results[0] ?? {};
      const episodes = results.slice(
        1,
        results.length,
      ) as PodcastEpisodeResponse[];
      const description = episodes.length
        ? await getPodcastDescription(episodes[0].feedUrl)
        : undefined;
      const _podcast: Podcast = {
        artistName: track.artistName ?? '',
        artworkUrl100: track.artworkUrl100 ?? '',
        artworkUrl600: track.artworkUrl600 ?? '',
        collectionId: track.collectionId ?? 0,
        collectionName: track.collectionName,
        description,
        episodes: episodes.map(
          (episode) =>
            ({
              id: episode?.trackId ?? '',
              title: episode?.trackName ?? '',
              description: episode?.shortDescription
                ? episode?.shortDescription
                : episode?.description ?? '',
              pubDate: episode?.releaseDate ?? '',
              duration: episode?.trackTimeMillis ?? '',
              mediaContent: episode?.episodeUrl ?? '',
            } as PodcastEpisode),
        ),
      };
      setPodcast(_podcast);
      localStorage.setItem(
        toPodcastStorageKey(podcastId),
        JSON.stringify(_podcast),
      );
      localStorage.setItem(
        toPodcastUpdatedAtStorageKey(podcastId),
        String(Date.now()),
      );
    } catch (err) {
      console.trace(err);
    } finally {
      setLoading(false);
    }
  }, [podcastId]);

  useEffect(() => {
    fetchPodcast();
  }, [fetchPodcast]);

  return { podcast, loading };
};

async function getPodcastDescription(url: string): Promise<string> {
  try {
    const resp = await fetch(`https://api.allorigins.win/raw?url=${url}`);
    const data = await resp.text();
    const parsedData = new window.DOMParser().parseFromString(
      data ?? '',
      'text/xml',
    );
    return parsedData.querySelector('description')?.textContent ?? '';
  } catch (err) {
    console.trace(err);
    return '';
  }
}

export default usePodcast;
