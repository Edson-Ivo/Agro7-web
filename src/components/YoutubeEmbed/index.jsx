import React from 'react';

import { YoutubeEmbedContainer, YoutubeEmbedIFrame } from './styles';

const YoutubeEmbed = ({ embedId, title, name }) => (
  <YoutubeEmbedContainer>
    <YoutubeEmbedIFrame
      width="853"
      height="480"
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      name={name}
      title={title}
    />
  </YoutubeEmbedContainer>
);

export default YoutubeEmbed;
