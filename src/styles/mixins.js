export const ShrinkedLabel = () =>
  `font-size: 0.8em; 
  top: 8px; 
  transform: translateY(0%);`;

export const ShowTransition = () =>
  `@keyframes show {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }`;
