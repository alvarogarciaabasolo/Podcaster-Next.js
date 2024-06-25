import React, { PropsWithChildren } from 'react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';

type Props = PropsWithChildren<{
  loading?: boolean | null;
}>;

export function HeaderLayout({ loading, children }: Props) {
  return (
    <Root>
      <Header>
        <LogoLink href="/">Podcaster</LogoLink>
        {loading && <LoadingDot />}
      </Header>
      <Content>{children}</Content>
    </Root>
  );
}

const Root = styled.div`
  display: grid;
  grid-template-rows: max-content 1fr;
  min-height: 100vh;
`;

const Header = styled.header`
  -webkit-backdrop-filter: blur(4px);
  align-items: center;
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid var(--color-border-subtle);
  display: flex;
  height: 60px;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 2;
`;

const Content = styled.div`
  min-height: 0;
`;

const LogoLink = styled(Link)`
  color: var(--color-primary);
  font-size: 22px;
  font-weight: var(--font-weight-black);
  text-decoration: none;
`;

const blink = keyframes`
 0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const LoadingDot = styled.span`
  animation: ${blink} 1s ease-in-out infinite;
  background: var(--color-primary);
  border-radius: 50%;
  display: inline-block;
  height: 16px;
  width: 16px;
`;
