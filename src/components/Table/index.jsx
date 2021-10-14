import styled from 'styled-components';

const Table = styled.table`
  margin-bottom: 0;

  width: 100%;
  color: ${props => props.theme.colors.black};

  border-collapse: collapse;

  tbody {
    tr {
      cursor: ${props => (!props.noClick ? 'pointer' : 'default')};
      transition: background 0.8s;
      transition: transform ease-in-out 0.25s;
      background-position: center;

      @media (prefers-reduced-motion: reduce) {
        transition: none !important;
      }

      &:hover {
        background-color: ${props => props.theme.colors.gray};
      }

      &:active {
        background-color: ${props => props.theme.colors.black_10};
      }
    }
  }

  th {
    vertical-align: middle;
    padding: 0.55rem;
    text-align: inherit;

    &:last-of-type {
      text-align: center;
    }
  }

  td {
    padding: 1rem 0.55rem;
    border-top: 1px solid ${props => props.theme.colors.border};

    &:last-of-type {
      cursor: default;
    }
  }
`;

export default Table;
