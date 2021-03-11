import styled from 'styled-components';

export const Card = styled.div`
  color: ${props => props.fontColor || props.theme.colors.white};
  display: flex;
  cursor: pointer;
  flex-direction: row;
  width: 100%;
  min-height: ${props => props.height || '140px'};
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.color || props.theme.colors.white};
  box-shadow: 0px 6px 22px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  padding: 15px 0px 15px 25px;
  overflow: hidden;
  margin-bottom: 10px;

  .card-info {
    width: 70%;

    h4 {
      margin-bottom: 10px;
    }

    p {
      font-size: 16px;
    }
  }

  .card-image {
    align-self: center;
    width: 30%;
    display: flex;
    justify-content: flex-end;
    padding-right: 24px;
  }

  .card-icon {
    font-size: 2.3em;
  }

  &:hover {
    filter: brightness(1.1);
  }
`;
