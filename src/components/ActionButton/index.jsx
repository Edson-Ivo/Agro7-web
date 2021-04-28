import React from 'react';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faInfoCircle,
  faTrash,
  faFileDownload
} from '@fortawesome/free-solid-svg-icons';

import { ActionButtonContainer } from './styles';

const ActionButton = ({
  id,
  path,
  onDelete,
  info = '/detalhes',
  noInfo = false,
  noEdit = false,
  download = '',
  edit = '/editar'
}) => (
  <ActionButtonContainer>
    {download && (
      <a
        href={download}
        title="Baixar arquivo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>
          <FontAwesomeIcon icon={faFileDownload} />
        </div>
      </a>
    )}

    {!noInfo && (
      <Link href={`${path}/${id}${info}`}>
        <a title="Informações">
          <div>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
        </a>
      </Link>
    )}

    {!noEdit && (
      <Link href={`${path}/${id}${edit}`}>
        <a title="Editar">
          <div>
            <FontAwesomeIcon icon={faEdit} />
          </div>
        </a>
      </Link>
    )}
    <div
      onClick={() => onDelete()}
      onKeyPress={() => onDelete()}
      title="Deletar"
      role="button"
      tabIndex="0"
    >
      <div>
        <FontAwesomeIcon icon={faTrash} />
      </div>
    </div>
  </ActionButtonContainer>
);

export default ActionButton;
