import React from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CarouselContainer = styled.div`
  width: 95%;

  .slick-prev {
    left: -15px;
  }

  .slick-next {
    right: -15px;
  }

  .slick-prev,
  .slick-next {
    height: 40px;
    width: 40px;

    &:before {
      color: ${props => props.theme.colors.black};
      font-size: 40px;
    }
  }
`;

const Carousel = ({ children, ...options }) => {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    ...options
  };

  return (
    <CarouselContainer>
      <Slider {...settings}>{children}</Slider>
    </CarouselContainer>
  );
};

export default Carousel;
