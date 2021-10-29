import React from 'react';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faInfoCircle,
  faTrash,
  faFileDownload,
  faTimes,
  faCheck,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';

import downloadDocument from '@/helpers/downloadDocument';
import { ActionButtonContainer } from './styles';

const ActionButton = ({
  id,
  path,
  onDelete = () => {},
  onAccept,
  onRemove = () => {},
  onResendMail = null,
  info = '/detalhes',
  noInfo = false,
  noEdit = false,
  noDelete = false,
  noAccept = true,
  noRemove = true,
  download = '',
  onlyView = false,
  edit = '/editar'
}) => (
  <ActionButtonContainer>
    {download && (
      <div
        onClick={() => downloadDocument(download)}
        onKeyPress={() => downloadDocument(download)}
        title="Baixar arquivo"
        role="button"
        tabIndex="0"
      >
        <div>
          <FontAwesomeIcon icon={faFileDownload} />
        </div>
      </div>
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

    {!noEdit && !onlyView && (
      <Link href={`${path}/${id}${edit}`}>
        <a title="Editar">
          <div>
            <FontAwesomeIcon icon={faEdit} />
          </div>
        </a>
      </Link>
    )}

    {onResendMail && (
      <div
        onClick={() => onResendMail()}
        onKeyPress={() => onResendMail()}
        title="Reenviar e-mail"
        role="button"
        tabIndex="0"
      >
        <div>
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
      </div>
    )}

    {!noAccept && !onlyView && (
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

    {!noRemove && !onlyView && (
      <div
        onClick={() => onRemove() || onDelete()}
        onKeyPress={() => onRemove() || onDelete()}
        title="Remover"
        role="button"
        tabIndex="0"
      >
        <div>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
    )}

    {!noDelete && !onlyView && (
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
