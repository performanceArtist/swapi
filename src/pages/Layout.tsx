import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import * as Styled from './Layout.styled';
import { css, Global } from '@emotion/react';

export type LayoutProps = {
  children: ReactNode;
};

export const Layout = (props: LayoutProps) => {
  const { children } = props;
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <Global
        styles={css`
          * {
            margin: 0;
            padding: 0;
            outline: 0;
            box-sizing: border-box;
          }

          html,
          body {
            min-height: 100vh;
          }

          #root {
            margin: 0 auto;
            display: flex;
            align-items: stretch;
            height: 100vh;
          }
        `}
      />
      <Styled.Container>
        <Styled.Header>
          <Box onClick={(e) => e.preventDefault()}>
            <Link style={{ cursor: 'pointer ' }} onClick={() => navigate('/')}>
              Home
            </Link>
          </Box>
        </Styled.Header>
        <Styled.Content>{children}</Styled.Content>
      </Styled.Container>
    </React.Fragment>
  );
};
