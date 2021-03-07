import styled from 'styled-components';

export const Card = styled.div`
  color: ${props => props.theme.colors.white};
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 140px;
  background: linear-gradient(
    180deg,
    rgba(255, 172, 56, 0.7) 0%,
    rgba(255, 172, 56, 0.7) 0.01%,
    rgba(236, 150, 28, 0.7) 103.09%
  );
  box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.05);
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
    direction: rtl;
    width: 30%;
  }
`;
