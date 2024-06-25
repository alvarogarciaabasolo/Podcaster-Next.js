import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { PodcastCard } from '@/components/PodcastCard';
import { toPodcastEpisodePath } from '@/lib/paths';
import { formatTime } from '@/lib/utils';
import { HeaderLayout } from '@/components/HeaderLayout';
import usePodcast from '@/lib/usePodcast';
import { useRouter } from 'next/router';

export default function Podcast() {
  const router = useRouter();
  const podcastId = router.query.podcastId as string;

  const { podcast, loading } = usePodcast({
    podcastId,
  });

  let content: React.ReactNode = null;
  if (loading === null) {
    content = '';
  } else if (loading) {
    content = <div>Loading...</div>;
  } else if (!podcast) {
    content = <div>There was a mistake.</div>;
  } else {
    content = (
      <Root data-testid={podcastId}>
        <PodcastCard podcastId={podcastId} podcast={podcast} />
        <Container>
          <EpisodesCount>Episodes: {podcast.episodes.length}</EpisodesCount>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {podcast.episodes.map((episode) => (
                  <tr key={episode.id}>
                    <td>
                      <EpisodeLink
                        href={toPodcastEpisodePath(podcastId, episode.id)}
                      >
                        <strong>{episode.title}</strong>
                      </EpisodeLink>
                    </td>
                    <td>
                      {new Intl.DateTimeFormat('es-ES').format(
                        new Date(episode.pubDate),
                      )}
                    </td>
                    <td>{formatTime(episode.duration)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </Container>
      </Root>
    );
  }

  return <HeaderLayout loading={loading}>{content}</HeaderLayout>;
}

const Root = styled.div`
  align-items: start;
  display: grid;
  gap: 60px;
  grid-template-columns: 240px 1fr;
  margin: 0 auto;
  max-width: var(--screen-lg);
  padding: 20px;
`;

const EpisodesCount = styled.div`
  border-radius: 6px;
  box-shadow: rgb(0 0 0 / 15%) 0 1px 2px 1px;
  font-size: 24px;
  font-weight: var(--font-weight-black);
  margin-bottom: 10px;
  padding: 10px 15px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TableContainer = styled.div`
  padding: 20px;
  box-shadow: rgb(0 0 0 / 15%) 0 1px 2px 1px;
`;

const EpisodeLink = styled(Link)`
  text-decoration: none;
  color: var(--color-primary);
`;

const Table = styled.table`
  border-collapse: collapse;
  border-radius: 6px;
  padding: 20px;
  width: 100%;
  thead > tr {
    border-bottom: 2px solid var(--color-border-subtle);
    font-size: 16px;
  }
  td,
  th {
    border-bottom: 1px solid var(--color-border-subtle);
    padding: 0 10px;
    text-align: left;
  }
  tr:nth-child(even) {
    background-color: var(--color-background-muted);
  }
  tr {
    height: 40px;
    font-size: 14px;
  }
  thead tr th:last-child,
  tbody tr td:last-child {
    text-align: center;
  }
`;
