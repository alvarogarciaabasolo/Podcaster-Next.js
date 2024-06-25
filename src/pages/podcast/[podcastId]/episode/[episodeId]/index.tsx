import { PodcastCard } from '@/components/PodcastCard';
import { HeaderLayout } from '@/components/HeaderLayout';
import usePodcast from '@/lib/usePodcast';
import { removeHtmlTags } from '@/lib/utils';
import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

export default function PodcastEpisode() {
  const router = useRouter();
  const episodeId = router.query.episodeId;
  const podcastId = router.query.podcastId as string;

  const { podcast, loading } = usePodcast({
    podcastId,
  });

  let content: React.ReactNode = null;

  if (loading) {
    content = <div>Loading...</div>;
  } else if (!podcast) {
    content = <div>There was a mistake.</div>;
  } else {
    const episode = podcast.episodes.find((e) => e.id === Number(episodeId))!;
    content = (
      <Root>
        <PodcastCard podcastId={podcastId} podcast={podcast} />
        <EpisodeContent>
          <Title>{episode.title}</Title>
          <p>{removeHtmlTags(episode.description)}</p>
          <Audio controls>
            <source
              data-testid="audio-source"
              src={episode.mediaContent}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </Audio>
        </EpisodeContent>
      </Root>
    );
  }

  return <HeaderLayout loading={loading}>{content}</HeaderLayout>;
}

const Root = styled.div`
  display: grid;
  gap: 15px;
  grid-template-columns: 240px 1fr;
  margin: 0 auto;
  max-width: var(--screen-lg);
  padding: 20px;
  align-items: start;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: var(--font-weight-black);
`;

const Audio = styled.audio`
  width: 100%;
  margin-top: 25px;
`;

const EpisodeContent = styled.div`
  border-radius: 6px;
  box-shadow: rgb(0 0 0 / 15%) 0 1px 2px 1px;
  margin: 0 auto;
  max-width: var(--screen-sm);
  padding: 20px;
  width: 100%;
  h1 {
    margin: 0 0 16px 0;
  }
`;
