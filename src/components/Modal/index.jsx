import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTransition } from 'react-spring';

import Button from '../Button';

import { Container, Content, Header, Body, Footer } from './styles';

const Modal = data => {
  const transitions = useTransition(data.data, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });
  return (
    <Container>
      {transitions.map(({ item, key, props }) => (
        <Content key={key} style={props}>
          <Header>
            <h5>{item.title}</h5>
          </Header>
          <Body>
            <p>{item.text}</p>
          </Body>
          <Footer>
            {item.confirm ? (
              <>
                <Button type="button" onClick={item.onCancel}>
                  Não
                </Button>
                <Button type="button" onClick={item.onConfirm}>
                  Sim
                </Button>
              </>
            ) : (
              <button type="button" onClick={item.onConfirm}>
                Entendi
              </button>
            )}
          </Footer>
          <button type="button" onClick={item.onCancel}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </Content>
      ))}
    </Container>
  );
};

export default Modal;
