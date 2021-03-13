import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Button from '@/components/Button';

export const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;

  div {
    margin: 0;
    width: 17%;
    margin-top: 24px;

    &.prev {
      margin-right: 10px;
    }

    &.next {
      margin-left: 10px;
    }

    @media screen and (max-width: ${props =>
        props.theme.breakpoints.mobile}px) {
      margin: 0 auto !important;
      margin-top: 12px;
      width: 100%;
    }
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    flex-direction: column;
  }
`;

const Pagination = ({ url, actual = 1, maxRecords = 10, evaluate = {} }) => {
  const router = useRouter();

  return (
    <PaginationWrapper>
      {actual != 1 && (
        <div className="prev">
          <Button
            onClick={() => router.push(`${url}?page=${Number(actual) - 1}`)}
          >
            Anterior
          </Button>
        </div>
      )}
      {evaluate.length === maxRecords && (
        <div className="next">
          <Button
            className="next"
            onClick={() => router.push(`${url}?page=${Number(actual) + 1}`)}
          >
            Próximo
          </Button>
        </div>
      )}
    </PaginationWrapper>
  );
};

export default Pagination;
