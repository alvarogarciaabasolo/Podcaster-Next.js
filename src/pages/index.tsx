import { ChangeEvent, useMemo, useState } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import styled from 'styled-components';
import usePodcasts from '@/lib/usePodcasts';
import Link from 'next/link';
import { toPodcastPath } from '@/lib/paths';
import { HeaderLayout } from '@/components/HeaderLayout';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { loading, podcasts } = usePodcasts();
  const [searchValue, setSearchValue] = useState<string>('');

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(evt.target.value.trim().toLowerCase());
  };

  const filteredPodcasts = useMemo(() => {
    return podcasts
      ? searchValue
        ? podcasts.filter(
            (podcast) =>
              podcast.title.toLowerCase().includes(searchValue) ||
              podcast.author.toLowerCase().includes(searchValue),
          )
        : podcasts
      : [];
  }, [podcasts, searchValue]);

  let content: React.ReactNode = null;

  if (loading) {
    content = <div>Loading...</div>;
  } else if (!podcasts) {
    content = <div>There was a mistake..</div>;
  } else {
    content = (
      <Wrapper>
        <Header>
          <PodcastCount>{filteredPodcasts.length}</PodcastCount>
          <SearchInput
            placeholder="Filter podcasts..."
            type="search"
            onChange={handleInputChange}
          />
        </Header>
        <Podcasts>
          {filteredPodcasts.map((podcast) => (
            <Podcast
              role="link"
              key={podcast.id}
              href={toPodcastPath(podcast.id)}
            >
              <PodcastImage
                width={125}
                height={125}
                src={podcast.image}
                alt={podcast.title}
              />
              <PodcastTitle>{podcast.title}</PodcastTitle>
              <PodcastAuthor>Author: {podcast.author}</PodcastAuthor>
            </Podcast>
          ))}
        </Podcasts>
      </Wrapper>
    );
  }

  return <HeaderLayout loading={loading}>{content}</HeaderLayout>;
}

const Wrapper = styled.div`
  padding: 0 20px 80px 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px 0;
`;

const Podcasts = styled.div`
  column-gap: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0 auto;
  padding-top: 60px;
  row-gap: 160px;
`;

const Podcast = styled(Link)`
  align-items: center;
  border-radius: 6px;
  box-shadow: rgb(0 0 0 / 15%) 0 1px 2px 1px;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: fit-content;
  justify-content: flex-start;
  padding: 90px 10px 20px;
  position: relative;
  text-decoration: none;
`;

const PodcastImage = styled.img`
  position: absolute;
  width: 125px;
  height: 125px;
  object-fit: cover;
  border-radius: 100%;
  top: -40px;
`;

const PodcastTitle = styled.div`
  text-align: center;
  text-transform: uppercase;
  font-weight: var(--font-weight-bold);
`;

const PodcastAuthor = styled.div`
  text-align: center;
  color: var(--color-text-subtle);
  font-weight: var(--font-weight-bold);
  font-size: 14px;
`;

const PodcastCount = styled.div`
  background: #2d79b8;
  padding: 0 6px;
  font-size: 18px;
  color: #fff;
  border-radius: 8px;
  font-weight: var(--font-weight-bold);
`;

const SearchInput = styled.input`
  border-radius: 4px;
  border: 1px solid var(--color-border-primary);
  font-family: inherit;
  font-size: inherit;
  padding: 8px 10px;
  width: 275px;
`;
