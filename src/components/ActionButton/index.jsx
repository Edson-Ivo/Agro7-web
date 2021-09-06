import React from 'react';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faInfoCircle,
  faTrash,
  faFileDownload,
  faTimes,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

import { ActionButtonContainer } from './styles';

const ActionButton = ({
  id,
  path,
  onDelete,
  onAccept,
  onRemove,
  info = '/detalhes',
  noInfo = false,
  noEdit = false,
  noDelete = false,
  noAccept = true,
  noRemove = true,
  download = '',
  edit = '/editar'
}) => (
  <ActionButtonContainer>
    {download && (
      <Link href={download} replace passHref>
        <a target="_blank" rel="noopener noreferrer" title="Baixar arquivo">
          <div>
            <FontAwesomeIcon icon={faFileDownload} />
          </div>
        </a>
      </Link>
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

    {!noAccept && (
      <div
        onClick={() => onAccept()}
        onKeyPress={() => onAccept()}
        title="Aceitar"
        role="button"
        tabIndex="0"
      >
        <div>
          <FontAwesomeIcon icon={faCheck} />
        </div>
      </div>
    )}

    {!noRemove && (
      <div
        onClick={() => onRemove()}
        onKeyPress={() => onRemove()}
        title="Remover"
        role="button"
        tabIndex="0"
      >
        <div>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
    )}

    {!noDelete && (
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
    )}
  </ActionButtonContainer>
);

export default ActionButton;
