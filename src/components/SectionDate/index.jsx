import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faSeedling, faTruck } from '@fortawesome/free-solid-svg-icons';

import {
  StyledSectionDate,
  StyledSectionDateRow,
  StyledSectionDateRowTitle,
  StyleSectionDateRowInfo,
  StyledSectionDateRowIcon,
  StyledSectionDateRowDescription
} from './styles';

const dataRows = {
  plant: {
    description: 'Data de plantio',
    icon: faTint
  },
  harvest: {
    description: 'Data da colheita',
    icon: faSeedling
  },
  transport: {
    description: 'Data de transporte',
    icon: faTruck
  }
};

export const SectionDate = ({
  plantDate = null,
  harvestDate = null,
  transportDate = null
}) => (
  <StyledSectionDate>
    {plantDate && (
      <StyledSectionDateRow>
        <StyledSectionDateRowTitle>{plantDate}</StyledSectionDateRowTitle>
        <StyleSectionDateRowInfo>
          <StyledSectionDateRowIcon>
            <FontAwesomeIcon icon={dataRows.plant.icon} />
          </StyledSectionDateRowIcon>
          <StyledSectionDateRowDescription>
            {dataRows.plant.description}
          </StyledSectionDateRowDescription>
        </StyleSectionDateRowInfo>
      </StyledSectionDateRow>
    )}
    {harvestDate && (
      <StyledSectionDateRow>
        <StyledSectionDateRowTitle>{harvestDate}</StyledSectionDateRowTitle>
        <StyleSectionDateRowInfo>
          <StyledSectionDateRowIcon>
            <FontAwesomeIcon icon={dataRows.harvest.icon} />
          </StyledSectionDateRowIcon>
          <StyledSectionDateRowDescription>
            {dataRows.harvest.description}
          </StyledSectionDateRowDescription>
        </StyleSectionDateRowInfo>
      </StyledSectionDateRow>
    )}
    {transportDate && (
      <StyledSectionDateRow>
        <StyledSectionDateRowTitle>{transportDate}</StyledSectionDateRowTitle>
        <StyleSectionDateRowInfo>
          <StyledSectionDateRowIcon>
            <FontAwesomeIcon icon={dataRows.transport.icon} />
          </StyledSectionDateRowIcon>
          <StyledSectionDateRowDescription>
            {dataRows.transport.description}
          </StyledSectionDateRowDescription>
        </StyleSectionDateRowInfo>
      </StyledSectionDateRow>
    )}
  </StyledSectionDate>
);
