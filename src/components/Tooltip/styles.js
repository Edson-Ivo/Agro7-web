import styled from 'styled-components';
import { ShowTransition } from '@/styles/mixins';

export const TooltipContainer = styled.div`
  align-items: center;
  animation: show 0.3s;
  background: ${props => props.theme.colors.white};
  border-radius: 10px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
  margin: 0 20px;
  min-height: ${props => props.minHeight};
  max-width: ${props => (props.responsive ? '100%' : 'unset')};
  position: absolute;
  top: 65px;
  width: ${props => props.minWidth};
  z-index: 99999;
  ${props => [props.position]}: -20px;

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }

  .form-group {
    flex-wrap: wrap;
    margin: 10px 0;

    button {
      width: 100%;
    }

    &:first-of-type {
      margin-top: 0;
    }
  }

  & > div {
    padding: 10px;
    min-width: 225px;
    width: 100%;

    @media screen and (max-width: ${props =>
        props.theme.breakpoints.mobile}px) {
      min-width: 200px;
    }

    ul {
      color: ${props => props.theme.colors.black_75};
      font-size: 1em;
      font-family: ${props => props.theme.fonts.montserratFamily};
      font-weight: 700;
      line-height: 1em;
      list-style-type: none;
    }

    li {
      border-radius: 4px;
      cursor: pointer;
      display: block;
      padding: 10px 0;
      transition: all 0.3s;
      width: 100%;

      @media (prefers-reduced-motion: reduce) {
        transition: none !important;
      }

      span {
        padding-left: 20px;

        .icon {
          font-size: 1.25em;
          margin-right: 5px;
          width: 20px;
        }
      }
    }

    li:hover {
      background: ${props => props.theme.colors.gray};
      color: ${props => props.theme.colors.black};
    }
  }

  & form li {
    margin-bottom: 5px;
    padding: 0 !important;
  }

  .select__value-container {
    height: 50px;
  }

  .select__control {
    margin: 5px 0 0 !important;
  }

  ${ShowTransition}
`;
