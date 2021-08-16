import styled from 'styled-components';
import { ShowTransition } from '@/styles/mixins';

export const TooltipContainer = styled.div`
  z-index: 3;
  position: absolute;
  list-style-type: none;
  font-size: 1em;
  line-height: 1em;
  padding: 10px 0px;
  align-items: center;
  background: ${props => props.theme.colors.white};
  border-radius: 10px;
  font-weight: 700;
  font-family: ${props => props.theme.fonts.montserratFamily};
  cursor: pointer;
  animation: show 0.3s;
  top: 60px;
  right: 0;
  z-index: 2;
  color: ${props => props.theme.colors.black_75};
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }

  & > div {
    min-width: 225px;
    width: 100%;

    @media screen and (max-width: ${props =>
        props.theme.breakpoints.mobile}px) {
      min-width: 200px;
    }

    li {
      display: block;
      padding: 10px 0;
      width: 100%;
      transition: all 0.3s;

      @media (prefers-reduced-motion: reduce) {
        transition: none !important;
      }

      span {
        padding-left: 20px;

        .icon {
          width: 20px;
          font-size: 1.25em;
          margin-right: 5px;
        }
      }
    }

    li:hover {
      background: #23424e1e;
      color: ${props => props.theme.colors.black};
    }

    &:before {
      content: '';
      position: absolute;
      width: 0;
      top: -10px;
      right: 9px;
      border-bottom: 10px solid ${props => props.theme.colors.white};
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
    }
  }

  ${ShowTransition}
`;
