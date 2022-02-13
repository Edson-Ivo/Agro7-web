import React, { useEffect, useState } from 'react';
import { lookup } from 'mime-types';

import ImageContainer from '@/components/ImageContainer';
import PDFViewer from '@/components/PDFViewer';
import Loader from '@/components/Loader';
import Button from '@/components/Button';
import downloadDocument, { showDocument } from '@/helpers/downloadDocument';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const DocumentsViewer = ({
  src,
  name,
  message = 'Clique aqui para ver o documento atual'
}) => {
  const [doc, setDoc] = useState('');
  const [loading, setLoading] = useState(true);
  const mimeType = lookup(src);

  useEffect(() => {
    (async () => {
      const d = await showDocument(src);

      setDoc(d);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      {!loading && doc ? (
        <>
          {([
            'image/gif',
            'image/png',
            'image/jpeg',
            'image/bmp',
            'image/webp'
          ].includes(mimeType) && (
            <>
              <ImageContainer src={doc} alt={`Documento ${name}`} />
              <Button
                type="button"
                className="primary"
                onClick={() => downloadDocument(src)}
                style={{ marginBottom: 20 }}
              >
                <FontAwesomeIcon icon={faDownload} /> Baixar Documento
              </Button>
            </>
          )) ||
            (mimeType === 'application/pdf' && (
              <PDFViewer
                src={doc}
                alt={`Documento ${name}`}
                pdfName={`${name}.pdf`}
                alertMessage="Se você não conseguir abrir ou visualizar o relatório, baixe-o no botão abaixo:"
                downloadMessage="Baixar Documento"
                fitH
              />
            )) || (
              <Button
                type="button"
                onClick={() => downloadDocument(src)}
                style={{ marginBottom: 20 }}
              >
                {message}
              </Button>
            )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default DocumentsViewer;
