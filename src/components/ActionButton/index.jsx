import React from 'react';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faInfoCircle,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

import { ActionButtonContainer } from './styles';
import Button from '../Button';

const ActionButton = ({ id, path, onDelete }) => (
  <ActionButtonContainer>
    <div>
      <Link href={`${path}/info/${id}`}>
        <FontAwesomeIcon icon={faInfoCircle} />
      </Link>
    </div>
    <div>
      <Link href={`${path}/edit/${id}`}>
        <FontAwesomeIcon icon={faEdit} />
      </Link>
    </div>
    <div>
      <Button onClick={() => onDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </div>
  </ActionButtonContainer>
);

export default ActionButton;
