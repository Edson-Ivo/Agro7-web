import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import ReactPaginate from 'react-paginate';

export const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 40px;
  justify-content: center;
  width: 100%;

  ul {
    margin: 0;
    display: flex;
    padding: 0;
    flex-direction: row;
    flex-wrap: wrap;
    list-style: none;
    align-items: center;
    justify-content: center;
    height: 100%;

    li {
      height: 50px;

      &.disabled {
        opacity: 0.38;
        cursor: default;
        pointer-events: none;
      }
    }

    a {
      color: ${props => props.theme.colors.primary};
      border-radius: 9999px;
      cursor: pointer;
      text-decoration: none;
      margin: 0 3px;
      padding: 8px 12px;
      box-sizing: border-box;
      text-align: center;
      transition: all 0.3s;
      cursor: pointer;
      font-family: Montserrat;
      font-weight: 700;
      font-size: 1em;
      line-height: 1.25em;
      vertical-align: middle;

      &:hover {
        opacity: 0.9;
      }
    }

    a:hover,
    .active > a {
      background: ${props => props.theme.colors.primary};
      color: #fff;
    }

    .break-me > a {
      border: none;
      cursor: default;
      pointer-events: none;
    }
  }
`;

const Pagination = ({
  url,
  currentPage = 1,
  itemsPerPage = 10,
  totalPages = 1,
  totalItems = 0,
  itemCount = 0,
  page = 'page'
}) => {
  const router = useRouter();
  const [actualPage, setActualPage] = useState(1);

  const handlePageClick = data => {
    router.push(`${url}?${page}=${Number(data.selected) + 1}`);
  };

  useEffect(() => {
    if (currentPage > totalPages) setActualPage(1);
    else setActualPage(currentPage);

    console.log(totalPages);
  }, []);

  return (
    <PaginationWrapper>
      <ReactPaginate
        previousLabel="Anterior"
        nextLabel="Próximo"
        breakLabel="..."
        breakClassName="break-me"
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        forcePage={Number(actualPage - 1)}
        onPageChange={handlePageClick}
        containerClassName="pagination"
        subContainerClassName="pages pagination"
        activeClassName="active"
      />
    </PaginationWrapper>
  );
};

export default Pagination;
