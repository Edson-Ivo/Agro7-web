import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useEffect,
  useState
} from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import ImageEditor from '@uppy/image-editor';
import Webcam from '@uppy/webcam';
// eslint-disable-next-line camelcase
import pt_BR from '@uppy/locales/lib/pt_BR';

import { Label } from '../Input/styles';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';

const InputFile = (
  {
    name,
    label = '',
    max = 1,
    min = 0,
    maxFileSize = 60,
    extensions = null,
    disabled = false,
    useImageEditor = true,
    useImageEditorOptions = {
      onlyCrop: false,
      aspectRatio: NaN
    },
    useWebcam = true
  },
  ref
) => {
  const errors = [
    {
      id: 'FILE_NOT_LOADED',
      message: 'Nenhum arquivo carregado.'
    },
    {
      id: 'MINIMUM_FILE_NOT_REACHED',
      message: `Você não alcançou o mínimo de arquivos necessários. Mínimo: ${min}.`
    },
    {
      id: 'MAXIMUM_FILE_EXCEEDED',
      message: `Você ultrapassou o limite máximo de arquivos permitidos. Máximo: ${max}.`
    }
  ];

  const fileQuantity = useRef(0);
  const error = useRef({
    id: '',
    message: ''
  });

  const [uppy, setUppy] = useState(null);

  const fileSize = useMemo(() => maxFileSize * 1024 * 1024, [maxFileSize]);
  const plugins = useMemo(() => {
    const list = [];

    if (useImageEditor) list.push('ImageEditor');
    if (useWebcam) list.push('Webcam');

    return list;
  }, [useImageEditor, useWebcam]);

  useEffect(() => {
    const uppyInstance = new Uppy({
      id: name,
      locale: {
        strings: {
          ...pt_BR.strings,
          save: 'Salvar'
        }
      },
      autoProceed: false,
      showProgressDetails: false,
      restrictions: {
        maxFileSize: fileSize,
        maxNumberOfFiles: max,
        minNumberOfFiles: min,
        allowedFileTypes: extensions
      }
    })
      .use(ImageEditor, {
        id: 'ImageEditor',
        quality: 1,
        cropperOptions: {
          autoCrop: 1,
          viewMode: 1,
          background: false,
          autoCropArea: 1,
          responsive: true,
          aspectRatio: useImageEditorOptions?.aspectRatio ?? NaN,
          rotatable: true,
          scalable: Boolean(!useImageEditorOptions?.onlyCrop),
          cropBoxResizable: true,
          zoomable: true,
          zoomOnTouch: true,
          zoomOnWheel: true
        },
        actions: {
          revert: false,
          rotate: true,
          granularRotate: true,
          flip: Boolean(!useImageEditorOptions?.onlyCrop),
          zoomIn: true,
          zoomOut: true,
          cropSquare: Boolean(!useImageEditorOptions?.onlyCrop),
          cropWidescreen: Boolean(!useImageEditorOptions?.onlyCrop),
          cropWidescreenVertical: Boolean(!useImageEditorOptions?.onlyCrop)
        }
      })
      .use(Webcam, {
        id: 'Webcam',
        modes: ['picture']
      })
      .on('file-added', () => {
        fileQuantity.current += 1;

        error.current = handleErrors();
      })
      .on('file-removed', () => {
        fileQuantity.current -= 1;

        error.current = handleErrors();
      });

    setUppy(uppyInstance);
  }, []);

  const getFiles = () => {
    const files = uppy.getFiles();
    const fileList = [];

    files.map(({ data }) => fileList.push(data));

    return fileList;
  };

  const handleErrors = () => {
    const [
      FILE_NOT_LOADED,
      MINIMUM_FILE_NOT_REACHED,
      MAXIMUM_FILE_EXCEEDED
    ] = errors;

    if (min > 0) {
      if (fileQuantity.current === 0) return FILE_NOT_LOADED;
      if (fileQuantity.current < min) return MINIMUM_FILE_NOT_REACHED;
      if (max !== null && fileQuantity.current > max)
        return MAXIMUM_FILE_EXCEEDED;
    }

    return {
      id: '',
      message: ''
    };
  };

  useImperativeHandle(ref, () => ({
    error,
    getFiles
  }));

  return (
    <>
      {uppy && (
        <div>
          {label && (
            <Label className={`input-label ${error?.id ? ' label_error' : ''}`}>
              {label}
            </Label>
          )}
          <div style={{ margin: '5px 0' }}>
            <Dashboard
              uppy={uppy}
              showProgressDetails={false}
              hideUploadButton
              proudlyDisplayPoweredByUppy={false}
              plugins={plugins}
              width="100%"
              autoOpenFileEditor={
                max === 1 && Boolean(useImageEditorOptions?.onlyCrop)
              }
              disabled={disabled}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default forwardRef(InputFile);
