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
    max = 1,
    min = 1
  },
  ref
) => {
  const [selected, setSelected] = useState({ selected: false, count: 0 });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState({ error: false, message: '' });
  const [dragged, setDragged] = useState(false);
  const inputRef = useRef(null);

  useEffect(
    () => () => {
      setSelected({ selected: false, count: 0 });
      setValidated(false);
      setError({ error: false, message: '' });
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

  const handleChange = e => {
    if (e.target.files.length === 0) {
      setSelected({ selected: false, count: 0 });
      setValidated(false);
      return;
    }

    if (e.target.files.length < min) {
      e.preventDefault();
      setError({
        error: 'MAXIMUM_FILE_EXCEEDED',
        message: `Você ultrapassou o limite máximo de arquivos permitidos. Max: ${max}`
      });
      return;
    }

    if (e.target.files.length > max) {
      e.preventDefault();
      setError({
        error: 'MINIMUM_FILE_NOT_REACHED',
        message: `Você não alcançou o mínimo de arquivos permitidos. Max: ${max}`
      });
      return;
    }

    setError({
      error: false,
      message: ''
    });

    if (e.target.files.length > 0) {
      setSelected({ selected: true, count: e.target.files.length });
    } else {
      setSelected({ selected: false, count: 0 });
    }

    if (multiple) {
      if (e.target.files.length >= min && e.target.files.length <= max) {
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
          name={`name${multiple && '[]'}`}
          onChange={handleChange}
          hidden
          multiple={multiple}
        />
      ) : (
        <input
          ref={inputRef}
          id={name}
          type="file"
          name={`name${multiple && '[]'}`}
          onChange={handleChange}
          hidden
          multiple={multiple}
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
