import styled from 'styled-components';

const Table = styled.table`
  margin-bottom: 0;

  width: 100%;
  color: ${props => props.theme.colors.black};

  border-collapse: collapse;

  tbody {
    tr {
      cursor: pointer;
      transition: background 0.8s;
      transition: transform ease-in-out 0.25s;
      background-position: center;

      &:hover {
        background: ${props => props.theme.colors.gray}
          radial-gradient(
            circle,
            transparent 1%,
            ${props => props.theme.colors.gray} 1%
          )
          center/15000%;
      }

      &:active {
        background-color: ${props => props.theme.colors.black_10};
        background-size: 100%;
        transition: background 0s;
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
