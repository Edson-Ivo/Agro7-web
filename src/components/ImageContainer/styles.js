import styled, { css } from 'styled-components';

export const ImageContent = styled.div`
  background-color: ${props => props.theme.colors.gray};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 10px;
  position: relative;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  max-height: 100%;
  width: 100%;
  max-width: 100%;
  margin-bottom: 16px;
  overflow: hidden;

  ${props =>
    props.zoom &&
    css`
      & img {
        cursor: zoom-in;
      }
    `}
`;

export const UpperLabel = styled.p`
  color: ${props => props.theme.colors.black_50};
  cursor: text;
  font-size: 1em;
  font-weight: 800;
  text-align: left;
  transition: ease 0.2s;
  margin-left: 10px;
  margin-bottom: 5px;
`;
