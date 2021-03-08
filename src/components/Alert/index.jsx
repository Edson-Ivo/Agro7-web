import styled, { css } from 'styled-components';

export const Alert = styled.div`
  color: ${props => props.theme.colors.white};

  ${props =>
    (!props?.type || props?.type === 'error') &&
    css`
      background: ${props.theme.colors.red};
    `};

  ${props =>
    props?.type === 'success' &&
    css`
      background: ${props.theme.colors.green};
    `};

  display: flex;
  flex-direction: row;
  width: 100%;
  font-weight: 700;
  border-radius: 10px;
  padding: 20px;
  overflow: hidden;
  margin-bottom: 10px;
`;
