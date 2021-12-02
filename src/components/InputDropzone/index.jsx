import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useEffect
} from 'react';
import Uppy from '@uppy/core';
import { Dashboard } from '@uppy/react';
import ImageEditor from '@uppy/image-editor';
import pt_BR from '@uppy/locales/lib/pt_BR';
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';

const InputDropzone = ({ name }, ref) => {
  const uppy = useMemo(
    () =>
      new Uppy({
        id: name,
        locale: pt_BR,
        proudlyDisplayPoweredByUppy: false,
        autoProceed: false,
        autoOpenFileEditor: true,
        restrictions: {
          maxFileSize: 15 * 1024 * 1024,
          maxNumberOfFiles: 10,
          allowedFileTypes: ['.jpg', '.jpeg', 'gif', '.png']
        }
      }),
    [name]
  );

  useEffect(() => () => uppy.close(), [uppy]);

  useImperativeHandle(ref, () => ({
    getFiles
  }));

  const getFiles = () => {
    const files = uppy.getFiles();
    const fileList = [];

    files.map(({ data }) => fileList.push(data));

    return fileList;
  };

  return (
    <div>
      <Dashboard
        uppy={uppy}
        showProgressDetails={true}
        hideUploadButton={true}
        plugins={['ImageEditor']}
        height={400}
        width="100%"
        maxNumberOfFiles={1}
        maxFileSize={15 * 1024 * 1024}
        allowedFileTypes={['.jpg', '.jpeg', 'gif', '.png']}
      />
    </div>
  );
};

export default forwardRef(InputDropzone);
