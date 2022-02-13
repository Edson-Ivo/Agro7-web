import { lookup } from 'mime-types';

import { api } from '../services/api';

export const getFileName = filePath =>
  filePath.split('\\').pop().split('/').pop();

const downloadDocument = async url => {
  await api.get(url, { responseType: 'blob' }).then(response => {
    const mimeType = lookup(url);
    const fileName = getFileName(url);

    const blob = new Blob([response.data], { type: mimeType });

    saveFile(blob, fileName);
  });
};

export const showDocument = async url => {
  const urlCreator = window.URL || window.webkitURL;

  const imageUrl = await api
    .get(url, { responseType: 'blob' })
    .then(response => {
      const mimeType = lookup(url);
      const blob = new Blob([response.data], { type: mimeType });

      return urlCreator.createObjectURL(blob);
    });

  return imageUrl;
};

const saveFile = (blob, filename) => {
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const a = document.createElement('a');
    document.body.appendChild(a);

    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download = filename;
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  }
};

export default downloadDocument;
