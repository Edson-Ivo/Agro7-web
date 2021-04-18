import styled, { css } from 'styled-components';

export const DateWrapper = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  width: 100%;
  &:after {
    content: '';
    display: flex;
    width: 30px;
    height: calc(100% - 20px);
    right: 0;
    position: absolute;
    z-index: 99;
    margin-left: auto;
    top: 0;
    right: -1px;
    background: linear-gradient(
      to right,
      rgba(252, 252, 253, 0) 0px,
      rgb(252, 252, 253) 80%
    );
  }
`;

export const DateContainer = styled.div`
  overflow: auto;
  width: 100%;
`;

export const DateContent = styled.div`
  display: flex;
  width: 490px;
`;

export const DateCard = styled.div`
  align-items: center;
  background-color: ${props =>
    !props.active ? props.theme.colors.gray : props.theme.colors.green};
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 70px;
  justify-content: center;
  margin-left: 16px;
  overflow: hidden;
  width: 55px;

  span {
    font-weight: 700;
  }

  &:first-of-type {
    margin-left: 0;
  }

  ${props =>
    props.active &&
    css`
      color: ${props.theme.colors.white};
      filter: drop-shadow(-3px 5px 8px rgba(38, 48, 46, 0.1));
    `}
`;
