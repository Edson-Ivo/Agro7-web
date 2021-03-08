import styled from 'styled-components';

const Table = styled.table`
  margin-bottom: 0;

  width: 100%;
  color: ${props => props.theme.colors.black};

  border-collapse: collapse;

  tbody {
    tr {
      transition: background 0.3s;

      &:hover {
        background-color: ${props => props.theme.colors.gray};
      }
    }
  }

  th {
    vertical-align: middle;

    padding: 0.55rem;

    text-align: inherit;
  }

  td {
    padding: 1rem 0.55rem;
    border-top: 1px solid ${props => props.theme.colors.border};
  }
`;

export default Table;
