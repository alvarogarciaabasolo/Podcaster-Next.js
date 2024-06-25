import React from 'react';
import styled from 'styled-components';
import { Podcast } from '../../lib/usePodcast';
import { toPodcastPath } from '../../lib/paths';
import { removeHtmlTags } from '@/lib/utils';
import Link from 'next/link';

interface Props {
  podcast: Podcast;
  podcastId: string;
}

export function PodcastCard({ podcast, podcastId }: Props) {
  return (
    <Card>
      <PodcastLink
        href={toPodcastPath(podcastId)}
        style={{ textAlign: 'center' }}
      >
        <PodcastImg
          width={175}
          height={175}
          alt="Podcast Cover Art"
          src={podcast.artworkUrl600}
        />
      </PodcastLink>
      <Separator />
      <PodcastLink href={toPodcastPath(podcastId)}>
        <Title>
          <CollectionName>{podcast.collectionName}</CollectionName>
          <i>by {podcast.artistName}</i>
        </Title>
      </PodcastLink>
      <Separator />
      <Subtitle>
        <DescriptionTitle>Description:</DescriptionTitle>
        <PodcastDescription>
          {removeHtmlTags(podcast.description)}
        </PodcastDescription>
      </Subtitle>
    </Card>
  );
}

const Card = styled.div`
  border-radius: 6px;
  border: 1px solid var(--color-border-subtle);
  display: flex;
  flex-direction: column;
  font-size: 14px;
  padding: 20px 10px;
  box-shadow: rgb(0 0 0 / 15%) 0 1px 2px 1px;
`;

const Title = styled.div`
  padding: 20px 10px;
`;

const CollectionName = styled.div`
  font-weight: var(--font-weight-black);
`;

const PodcastLink = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
`;

const PodcastImg = styled.img`
  border-radius: 12px;
  margin: 0 auto;
  margin-bottom: 20px;
  width: 175px;
`;

const DescriptionTitle = styled.span`
  font-weight: var(--font-weight-black);
`;

const PodcastDescription = styled.span`
  word-wrap: break-word;
  font-style: italic;
  line-height: 20px;
  font-size: 14px;
`;

const Subtitle = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Separator = styled.div`
  background: var(--color-border-subtle);
  height: 1px;
  width: 100%;
`;
