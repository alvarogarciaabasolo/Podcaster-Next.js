import React from 'react';
import { render, screen } from '@testing-library/react';
import Podcast from '@/pages/podcast/[podcastId]/index';
import usePodcast from '@/lib/usePodcast';
import '@testing-library/jest-dom';

jest.mock('@/lib/usePodcast');

const mockPodcast = {
  id: '1535809341',
  title: 'Test Podcast',
  episodes: [
    {
      id: '1',
      title: 'Episode 1',
      pubDate: '2021-01-01T00:00:00.000Z',
      duration: 3600,
    },
    {
      id: '2',
      title: 'Episode 2',
      pubDate: '2021-01-08T00:00:00.000Z',
      duration: 1800,
    },
  ],
};

type MockNextQuery = {
  query: {
    podcastId: string;
  };
};

describe('Podcast', () => {
  let useRouterMock: any;

  beforeAll(() => {
    useRouterMock = jest.spyOn(require('next/router'), 'useRouter');
  });

  beforeEach(() => {
    useRouterMock.mockReturnValue({
      query: { podcastId: '1535809341' },
    } as MockNextQuery);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Render the loading state', () => {
    (usePodcast as jest.Mock).mockReturnValue({
      podcast: null,
      loading: true,
    });

    render(<Podcast />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('Render the episodes of the podcast', async () => {
    (usePodcast as jest.Mock).mockReturnValue({
      podcast: mockPodcast,
      loading: false,
    });

    render(<Podcast />);
    expect(screen.getByTestId('1535809341')).toBeInTheDocument();
    await screen.findByText('Episode 1');
    await screen.findByText('Episode 2');
  });

  it('Renders the error state', () => {
    (usePodcast as jest.Mock).mockReturnValue({
      podcast: null,
      loading: false,
    });

    render(<Podcast />);
    expect(screen.getByText('There was a mistake.')).toBeInTheDocument();
  });

  it('Renders the PodcastCard image.', async () => {
    (usePodcast as jest.Mock).mockReturnValue({
      podcast: mockPodcast,
      loading: false,
    });

    render(<Podcast />);
    expect(screen.getByAltText('Podcast Cover Art')).toBeInTheDocument();
  });
});
