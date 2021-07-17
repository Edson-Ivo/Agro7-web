import React from 'react';

import { useMediaQuery } from 'react-responsive';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

import { Alert } from '../Alert/index';
import Button from '../Button/index';

import IFrame from './styles';

const PDFViewer = ({
  src,
  name,
  alertMessage,
  pdfName,
  downloadMessage,
  fitH = false
}) => {
  const isMobile = useMediaQuery({ maxWidth: 800 });

  return (
    <>
      <IFrame
        src={`${src}${fitH ? `#view=fitH` : null}`}
        name={name}
        title={name}
        mobileView={isMobile}
      />
      <Alert type="info" style={{ margin: '4px 0' }}>
        {alertMessage}
      </Alert>
      <a
        href={`${src}`}
        target="_blank"
        rel="noopener noreferrer"
        download={pdfName}
      >
        <Button className="primary" type="button">
          <FontAwesomeIcon icon={faDownload} /> {downloadMessage}
        </Button>
      </a>
    </>
  );
};

export default PDFViewer;
