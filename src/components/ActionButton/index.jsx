import React from 'react';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faInfoCircle,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

import { ActionButtonContainer } from './styles';

const ActionButton = ({ id, path, onDelete, info = '', edit = '/edit' }) => (
  <ActionButtonContainer>
    <Link href={`${path}${info}/${id}`}>
      <a>
        <div>
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
      </a>
    </Link>
    <Link href={`${path}${edit}/${id}`}>
      <a>
        <div>
          <FontAwesomeIcon icon={faEdit} />
        </div>
      </a>
    </Link>
    <div onClick={() => onDelete()}>
      <div>
        <FontAwesomeIcon icon={faTrash} />
      </div>
    </div>
  </ActionButtonContainer>
);

export default ActionButton;
