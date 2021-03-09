import React from 'react';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faInfoCircle,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

import { ActionButtonContainer } from './styles';

const ActionButton = ({ id, path, onDelete }) => (
  <ActionButtonContainer>
    <div>
      <Link href={`${path}/${id}`}>
        <a>
          <FontAwesomeIcon icon={faInfoCircle} />
        </a>
      </Link>
    </div>
    <div>
      <Link href={`${path}/edit/${id}`}>
        <a>
          <FontAwesomeIcon icon={faEdit} />
        </a>
      </Link>
    </div>
    <div>
      <div onClick={() => onDelete()}>
        <FontAwesomeIcon icon={faTrash} />
      </div>
    </div>
  </ActionButtonContainer>
);

export default ActionButton;
