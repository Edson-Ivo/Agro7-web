import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faDollarSign,
  faMapMarkedAlt,
  faBook,
  faUserSecret,
  faStore,
  faTruck,
  faUserEdit,
  faWallet,
  faSeedling
} from '@fortawesome/free-solid-svg-icons';

import { Card } from '@/components/Card/index';
import Container from '@/components/Container';
import Nav from '@/components/Nav';
import Navbar from '@/components/Navbar';

import { Section, SectionHeader, SectionBody } from '@/components/Section';

import { privateRoute } from '@/components/PrivateRoute';
import { SectionHeaderContent } from '@/components/SectionHeaderContent/index';
import { useFetch } from '@/hooks/useFetch';
import Error from '@/components/Error/index';
import isEmpty from '@/helpers/isEmpty';
import Loader from '@/components/Loader/index';

const data = [
  {
    href: 'detalhes',
    title: 'Detalhes',
    description:
      'Aqui, você terá acesso aos Detalhes e relacionados desse Usuário.',
    icon: faUser
  },
  {
    href: 'editar/perfil',
    title: 'Editar Perfil Público',
    description:
      'Aqui, você poderá editar o Perfil Público e Galeria Pública desse Usuário.',
    icon: faUserEdit
  },
  {
    href: 'propriedades',
    title: 'Propriedades',
    description:
      'Aqui, você terá acesso às Propriedades e relacionados desse Usuário.',
    icon: faMapMarkedAlt
  },
  {
    href: 'caderno-produtor',
    title: 'Caderno do Produtor',
    description:
      'Aqui, você terá acesso ao Caderno do Produtor e relacionados desse Usuário',
    icon: faBook
  },
  {
    href: 'vendas',
    title: 'Vendas',
    description:
      'Aqui, você terá acesso às Vendas e relacionados desse Usuário',
    icon: faDollarSign
  },
  {
    href: 'receita',
    title: 'Receita',
    description:
      'Aqui, você poderá checar a receita (ganhos e despesas) em determinado um período de tempo desse Usuário.',
    icon: faWallet
  },
  {
    href: 'projecao-colheita',
    title: 'Projeções das Colheitas',
    description:
      'Aqui, você poderá checar a projeção de colheitas em determinado um período de tempo desse Usuário.',
    icon: faSeedling
  },
  {
    href: 'vendas/distribuidoras',
    title: 'Distribuidoras',
    description:
      'Aqui, você terá acesso às Distribuidoras e relacionados desse Usuário',
    icon: faStore
  },
  {
    href: 'vendas/transportadoras',
    title: 'Transportadoras',
    description:
      'Aqui, você terá acesso às Transportadoras e relacionados desse Usuário',
    icon: faTruck
  },
  {
    href: 'tecnico',
    title: 'Painel Técnico',
    description:
      'Aqui, você terá acesso ao Painel Técnico e relacionados desse Usuário',
    icon: faUserSecret,
    types: ['tecnico']
  }
];

function AdminUsersOptions() {
  const router = useRouter();
  const { id } = router.query;

  const { data: dataUser, error: errorUser } = useFetch(
    `/users/find/by/id/${id}`
  );

  if (errorUser) return <Error error={errorUser} />;

  return (
    <>
      <Head>
        <title>
          Painel Administrativo | Opções do Usuário $
          {dataUser && dataUser?.name} - Agro7
        </title>
      </Head>

      <Navbar />
      <Container>
        <Nav />
        <Section>
          <SectionHeader>
            <SectionHeaderContent
              breadcrumbTitles={{
                '%usuario': dataUser?.name
              }}
              title={`Opções do Usuário ${dataUser?.name}`}
              description="Selecione nas opções abaixo o que você quer ver desse usuário."
              isLoading={isEmpty(dataUser)}
            />
          </SectionHeader>
          <SectionBody>
            <div className="SectionBody__content">
              {(dataUser && (
                <>
                  {data.map(
                    ({ href, title, description, icon, ...rest }, i) => {
                      if (rest?.types && !rest?.types?.includes(dataUser?.type))
                        return null;
                      return (
                        <Link
                          href={`/admin/users/${id}/${href}`}
                          key={i.toString()}
                        >
                          <Card height="90px" isLight>
                            <div className="card-info">
                              <h4>{title}</h4>
                              <p>{description}</p>
                            </div>
                            <div className="card-image">
                              <FontAwesomeIcon
                                icon={icon}
                                className="card-icon"
                              />
                            </div>
                          </Card>
                        </Link>
                      );
                    }
                  )}
                </>
              )) || <Loader />}
            </div>
          </SectionBody>
        </Section>
      </Container>
    </>
  );
}

export default privateRoute(['administrador'])(AdminUsersOptions);
