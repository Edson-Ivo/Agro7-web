import Button from '@/components/Button/index';
import Input from '@/components/Input/index';
import FileInput from '@/components/FileInput/index';
import React, { useRef } from 'react';

const Test = () => {
  const ref = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <>
      <form
        style={{ width: 400, margin: '0 auto' }}
        name="form"
        onSubmit={handleSubmit}
      >
        <h1>Teste de formulário</h1>
        <Input type="text" name="hii" initialValue="" label="Olá" />
        <FileInput
          ref={ref}
          name="fileinput"
          label="Selecione um arquivo"
          extensions={['.jpg']}
        />
        <Button className="primary" type="submit">
          Enviar
        </Button>
      </form>
    </>
  );
};

export default Test;
