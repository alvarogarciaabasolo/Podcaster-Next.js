export const toPodcastPath = (podcastId: string | number) => {
  return `/podcast/${podcastId}`;
};

export const toPodcastEpisodePath = (
  podcastId: string | number,
  episodeId: string | number,
) => {
  return `/podcast/${podcastId}/episode/${episodeId}`;
};
