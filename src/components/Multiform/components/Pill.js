import styled, { css } from 'styled-components';

const Pill = styled.div`
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 20px;
  background-color: #999;
  cursor: pointer;
  transition: all 0.4s;
  border: 2px solid ${props => props.theme.colors.background};

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }

  ${props =>
    props.label &&
    css`
      &:after {
        position: absolute;
        ${
          '' /* content: '${props.active || props.onlyView ? props.label : null}'; */
        }
        content: '${props.label}';
        width: max-content;
        color: ${props.active || props.complete
          ? props.accentColor || '#24a19c'
          : '#999'};
        font-weight: ${props.active ? 600 : 400};
        text-transform: uppercase;
        font-size: 11px;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
      }
    `}

  ${props =>
    props.active &&
    css`
      width: 20px;
      height: 20px;
      background-color: ${props.accentColor || '#24a19c'};

      &:before {
        position: absolute;
        content: '';
        background-color: ${props.theme.colors.background};
        width: 8px;
        height: 8px;
        border-radius: 8px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `}

  ${props =>
    props.complete &&
    css`
      width: 20px;
      height: 20px;
      background-color: ${props.accentColor || '#24a19c'};

      &:before {
        position: absolute;
        content: '${!props.onlyView ? '✓' : null}';
        color: ${props.theme.colors.background};
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `}
`;

export default Pill;
