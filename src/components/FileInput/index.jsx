import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import style from './style.module.css';

const FileInput = (
  {
    label = '',
    name = '',
    text = '',
    extensions = [],
    onChange = () => null,
    multiple = false,
    max = -1,
    min = -1
  },
  ref
) => {
  const defaultError = {
    error: 'FILE_NOT_LOADED',
    message: 'Nenhum arquivo carregado'
  };
  const [selected, setSelected] = useState({ selected: false, count: 0 });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(defaultError);
  const [dragged, setDragged] = useState(false);
  const inputRef = useRef(null);

  useEffect(
    () => () => {
      setSelected({ selected: false, count: 0 });
      setValidated(false);
      setError(defaultError);
    },
    []
  );

  useImperativeHandle(ref, () => ({
    error,
    selected,
    validated,
    getFiles: () => inputRef.current.files,
    getInput: () => inputRef.current
  }));

  const handleValidateExtensions = files => {
    if (extensions.length > 0) {
      return (
        [...files].filter(
          file =>
            extensions.filter(ext => {
              const ext1 = ext.slice(1, ext.length);
              const ext2 = /[^.]+$/.exec(file.name)[0];
              return ext1 === ext2;
            }).length > 0
        ).length === files.length
      );
    }
    return true;
  };

  const handleChange = e => {
    if (!handleValidateExtensions(e.target.files)) {
      e.preventDefault();
      e.stopPropagation();
      e.target.value = '';
      setError({
        error: 'EXTENSION_ERROR',
        message: `Problema na extensão do arquivo`
      });

      return;
    }

    if (e.target.files.length === 0) {
      setSelected({ selected: false, count: 0 });
      setValidated(false);
      e.preventDefault();
      return;
    }

    if (e.target.files.length < min && min > -1) {
      e.preventDefault();
      setError({
        error: 'MINIMUM_FILE_NOT_REACHED',
        message: `Você não alcançou o mínimo de arquivos permitidos. Min: ${min}`
      });
      return;
    }

    if (e.target.files.length > max && max > 0) {
      e.preventDefault();
      setError({
        error: 'MAXIMUM_FILE_EXCEEDED',
        message: `Você ultrapassou o limite máximo de arquivos permitidos. Max: ${max}`
      });
      return;
    }

    setError(defaultError);

    if (e.target.files.length > 0) {
      setSelected({ selected: true, count: e.target.files.length });
      setError({
        error: '',
        message: ''
      });
    } else {
      setSelected({ selected: false, count: 0 });
    }

    if (multiple) {
      if (
        (e.target.files.length >= min && e.target.files.length <= max) ||
        (e.target.files.length >= min && max < 1) ||
        (e.target.files.length <= max && min < 0)
      ) {
        setValidated(true);
      } else {
        setValidated(false);
      }
    } else if (e.target.files.length === 1) {
      setValidated(true);
    }

    onChange(e);
  };
  return (
    <div className={style.wrapper}>
      {extensions.length > 0 ? (
        <input
          ref={inputRef}
          accept={extensions.join(',')}
          id={name}
          type="file"
          name={`${name}${multiple ? '[]' : ''}`}
          onChangeCapture={handleChange}
          hidden
          multiple={multiple || max > 1}
        />
      ) : (
        <input
          ref={inputRef}
          id={name}
          type="file"
          name={`${name}${multiple ? '[]' : ''}`}
          onChangeCapture={handleChange}
          hidden
          multiple={multiple || max > 1}
        />
      )}

      <span className={style.label} htmlFor={name}>
        {label}
      </span>
      {selected.count > 0 && (
        <div className={style.files}>
          <div className={style.selecteds}>
            {selected.count > 1
              ? 'Arquivos selecionados'
              : 'Arquivo selecionado'}
          </div>
          {[...inputRef.current.files].map(file => (
            <span key={file.name} className={style.file}>
              <span className={style.fileName}>{file.name}</span>
              <span className={style.fileExt}>{file.type}</span>
            </span>
          ))}
        </div>
      )}
      <label
        onDragEnter={e => {
          e.preventDefault();
          e.stopPropagation();
          setDragged(true);
        }}
        onDragLeave={e => {
          e.preventDefault();
          e.stopPropagation();
          setDragged(false);
        }}
        onDragOver={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={e => {
          e.preventDefault();
          e.stopPropagation();

          if (e.dataTransfer.types[0] !== 'Files') return;

          if (!handleValidateExtensions(e.dataTransfer.files)) {
            setError({
              error: 'EXTENSION_ERROR',
              message: `Problema na extensão do arquivo`
            });

            setDragged(false);
            return;
          }

          if (!multiple && e.dataTransfer.files.length > 1) {
            setError({
              error: 'MAXIMUM_FILE_EXCEEDED',
              message: `Você ultrapassou o limite de arquivos (1)!`
            });
            setDragged(false);
            return;
          }

          inputRef.current.files = e.dataTransfer.files;
          handleChange({
            preventDefault: () => null,
            target: inputRef.current
          });
          setDragged(false);
        }}
        htmlFor={name}
        text={text}
        className={dragged ? `${style.input} ${style.border}` : style.input}
      >
        <div className={style.wrappericon}>
          <FontAwesomeIcon className={style.icon} icon={faFile} />
        </div>
      </label>
    </div>
  );
};

export default forwardRef(FileInput);
