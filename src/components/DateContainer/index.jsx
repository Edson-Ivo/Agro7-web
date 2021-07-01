import styled, { css } from 'styled-components';

export const DateWrapper = styled.div`
  display: flex;
  position: relative;
  height: 100%;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  width: 100%;

  &:after {
    content: '';
    display: flex;
    width: 15px;
    height: 100%;
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

  @media screen and (max-width: ${props => props.theme.breakpoints.mobile}px) {
    margin-top: -20px !important;
  }
`;

export const DateContainer = styled.div`
  margin: 10px 0;
  overflow: hidden;
  width: 100%;
`;

export const DateContent = styled.div`
  display: block;
  overflow: hidden;

  .scroll-container {
    display: flex;
    cursor: grab;
    width: 100%;

    &::-webkit-scrollbar {
      display: none;
    }

    & {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    &:active {
      cursor: grabbing;
    }
  }
`;

export const DateCardWrapper = styled.div`
  margin-left: 16px;

  &:nth-child(2) {
    margin-left: calc(32px + 55px);
  }
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
  user-select: none;
  overflow: hidden;
  width: 55px;
  transition: all 0.25s;

  span {
    font-weight: 700;
  }

  ${props =>
    props.active &&
    css`
      color: ${props.theme.colors.white};
      filter: drop-shadow(-3px 5px 8px rgba(38, 48, 46, 0.1));
    `}

  ${props =>
    !props.active &&
    css`
      &:hover {
        filter: brightness(0.97);
      }
    `}
`;

export const DateCardCalendar = styled.div`
  align-items: center;
  background: ${props => props.theme.colors.background};
  border-right: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  display: flex;
  font-size: 25px;
  height: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
  width: 75px;
  z-index: 1000;
  margin-top: -10px;

  & > div {
    align-items: center;
    border-radius: 8px;
    display: flex;
    height: 55px;
    justify-content: center;
    transition: all ease-in 0.2s;
    width: 55px;

    &:hover,
    &:focus {
      background: ${props => props.theme.colors.black_10};
      color: ${props => props.theme.colors.primary};
    }
  }
`;
