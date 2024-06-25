import { useState, useEffect } from 'react';

interface Podcast {
  id: string;
  title: string;
  author: string;
  image: string;
  url: string;
}

interface PodcastEntry {
  id: {
    attributes: {
      ['im:id']: string;
      label: string;
    };
    label: string;
  };
  link: {
    attributes: {
      type: string;
      href: string;
      rel: string;
    };
  };
  ['im:name']: {
    label: string;
  };
  ['im:artist']: {
    label: string;
    attributes: { href: string };
  };
  ['im:image']: {
    attributes: { height: string };
    label: string;
  }[];
}

interface TopPodcastsResponse {
  feed: {
    author: {
      name: { label: string };
      url: { label: string };
    };
    entry: PodcastEntry[];
    icon: { label: string };
    id: { label: string };
    link: {
      attributes: {
        href: string;
        rel: string;
        type: string;
      };
    };
    rights: { label: string };
    title: { label: string };
    updated: { label: string };
  };
}

const usePodcasts = (): {
  podcasts: Podcast[];
  loading: boolean;
} => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPodcasts = async () => {
    // Check if podcasts are already stored in localStorage
    const storedPodcasts = localStorage.getItem('podcasts');
    const storedDate = Number(localStorage.getItem('podcastsUpdatedAt'));
    // If the podcasts have already been stored and no more than one day has passed, retrieve them from localStorage.
    if (storedPodcasts && storedDate && Date.now() - storedDate < 86400000) {
      setPodcasts(JSON.parse(storedPodcasts));
      return;
    }
    // Make request to get the updated list of podcasts.
    setLoading(true);
    try {
      const resp = await fetch(
        'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json',
      );
      const topPodcastsResponse: TopPodcastsResponse = await resp.json();
      const entries = topPodcastsResponse.feed.entry;
      const podcastsArray = entries
        ? entries.map((entry) => ({
            id: entry.id.attributes['im:id'],
            title: entry['im:name'].label,
            author: entry['im:artist'].label,
            image: entry['im:image'][2].label,
            url: entry.link.attributes.href,
          }))
        : [];
      setPodcasts(podcastsArray);
      localStorage.setItem('podcasts', JSON.stringify(podcastsArray));
      localStorage.setItem('podcastsUpdatedAt', String(Date.now()));
    } catch (err) {
      console.trace(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, []);

  return { podcasts, loading };
};

export default usePodcasts;
