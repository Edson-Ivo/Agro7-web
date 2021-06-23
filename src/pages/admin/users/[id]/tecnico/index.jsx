import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkedAlt, faBell } from '@fortawesome/free-solid-svg-icons';

import { Card } from '@/components/Card/index';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';
import Error from '@/components/Error';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { privateRoute } from '@/components/PrivateRoute';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import { useFetch } from '@/hooks/useFetch';
import isEmpty from '@/helpers/isEmpty';

const data = [
  {
    href: '/admin/users/[id]/tecnico/propriedades',
    title: 'Propriedades Relacionadas',
    description:
      'Aqui você irá ver todas as propriedades que estão relacionadas para esse técnico.',
    icon: faMapMarkedAlt
  },
  {
    href: '/admin/users/[id]/tecnico/solicitacoes',
    title: 'Solicitação Técnica',
    description:
      'Aqui você irá gerenciar todas as solicitações técnicas de propriedades para esse técnico.',
    icon: faBell
  }
];

function TechnichianHome() {
  const router = useRouter();
  const { id } = router.query;

  const { data: dataUser, error: errorUser } = useFetch(
    `/users/find/by/id/${id}`
  );

  if (errorUser) return <Error error={errorUser} />;
  if (dataUser && dataUser?.type !== 'tecnico') return <Error error={404} />;

  return (
    <>
      <Head>
        <title>Painel Administrativo | Painel Técnico - Agro7</title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumb={[
                { route: '/', name: 'Home' },
                { route: '/tecnico', name: 'Painel Técnico' }
              ]}
              title="Painel Técnico"
              description={`Esse é o painel de técnico de ${dataUser?.name}, aqui você pode
                gerenciar suas solicitações para trabalhar em uma propriedade,
                como também, gerenciar as propriedades que esse técnico já está
                relacionado!`}
              isLoading={isEmpty(dataUser)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              {data.map(({ href, title, description, icon }, i) => (
                <Link href={href.replace('[id]', id)} key={i.toString()}>
                  <Card height="90px" isLight>
                    <div className="card-info">
                      <h4>{title}</h4>
                      <p>{description}</p>
                    </div>
                    <div className="card-image">
                      <FontAwesomeIcon icon={icon} className="card-icon" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrador'])(TechnichianHome);
