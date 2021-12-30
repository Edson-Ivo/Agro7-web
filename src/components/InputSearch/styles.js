import styled from 'styled-components';

export const InputSearchContainer = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  position: relative;
  width: 100%;

  hr {
    margin-top: 10px;
  }

  & button {
    & > svg {
      font-size: 14px;
      margin: 0 auto;
    }
  }

  & input,
  & button {
    height: 50px;
    margin-bottom: 0;
  }
`;

export const InputSearchFilter = styled.div`
  height: 50px;
  margin-right: 10px;
  width: 100px;

  button > svg {
    margin-right: 5px;
  }

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    width: ${({ searchable }) => (searchable ? '50px' : '100px')};

    button > svg {
      margin: 0 auto;
    }
  }
`;

export const InputSearchForm = styled.div`
  width: 100%;

  & > form > div {
    align-items: flex-end;
    display: flex;
    flex-direction: row;

    button {
      width: 50px;
    }

    & > div:first-child {
      flex: 1;
      padding-right: 10px;
      width: 100%;
    }
  }
`;
