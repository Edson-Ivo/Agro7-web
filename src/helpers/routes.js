const adminUserPropertyRoute = {
  '/admin/users/[userId]': {
    name: '%usuario',
    path: '/admin/users/[userId]'
  },

  '/admin/users/[userId]/propriedades': { name: 'Propriedades' },

  '/admin/users/[userId]/propriedades/[id]': {
    name: '%propriedade',
    path: '/admin/users/[userId]/propriedades/[id]/detalhes'
  },

  '/admin/users/[userId]/propriedades/[id]/documentos/[docId]/editar': {
    name: 'Editar Documento'
  },

  '/admin/users/[userId]/propriedades/[id]/documentos/cadastrar': {
    name: 'Cadastrar Documento'
  },
  '/admin/users/[userId]/propriedades/[id]/editar': { name: 'Editar' },
  '/admin/users/[userId]/propriedades/[id]/talhoes': { name: 'Talhões' },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas': {
    name: 'Culturas'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes': {
    name: 'Ações'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorio': {
    name: 'Relatório'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]': {
    name: 'Detalhes',
    path:
      '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/detalhes'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/editar': {
    name: 'Editar'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas': {
    name: 'Colheitas'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]': {
    name: '%data',
    path:
      '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]/detalhes'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]/detalhes/estoque': {
    name: 'Estoque'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]': {
    name: '%cultura',
    path:
      '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/detalhes'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/editar': {
    name: 'Editar'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios': {
    name: 'Relatórios Técnicos'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios/[actionId]/detalhes': {
    name: 'Relatório'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios/[actionId]/editar': {
    name: 'Adicionar Imagens'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/culturas/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]': {
    name: '%talhao',
    path: '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/detalhes'
  },

  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/editar': {
    name: 'Editar'
  },
  '/admin/users/[userId]/propriedades/[id]/talhoes/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/users/[userId]/propriedades/[id]/tecnicos': {
    name: 'Técnicos Relacionados'
  },

  '/admin/users/[userId]/propriedades/[id]/tecnicos/solicitacoes': {
    name: 'Solicitações'
  },

  '/admin/users/[userId]/propriedades/[id]/tecnicos/solicitacoes/cadastrar': {
    name: 'Solicitar'
  }
};

const adminUserTechPropertyRoute = {
  '/admin/users/[userId]': {
    name: '%usuario',
    path: '/admin/users/[userId]'
  },

  '/admin/users/[userId]/tecnico': { name: 'Técnico' },

  '/admin/users/[userId]/tecnico/propriedades': {
    name: 'Propriedades Relacionadas'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]': {
    name: '%propriedade',
    path: '/admin/users/[userId]/tecnico/propriedades/[id]/detalhes'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/documentos/[docId]/editar': {
    name: 'Editar Documento'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/documentos/cadastrar': {
    name: 'Cadastrar Documento'
  },
  '/admin/users/[userId]/tecnico/propriedades/[id]/editar': { name: 'Editar' },
  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes': {
    name: 'Talhões'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas': {
    name: 'Culturas'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes': {
    name: 'Ações'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]': {
    name: 'Detalhes',
    path:
      '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/detalhes'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/editar': {
    name: 'Editar'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas': {
    name: 'Colheitas'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]': {
    name: '%data',
    path:
      '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]/detalhes'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]/detalhes/estoque': {
    name: 'Estoque'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]': {
    name: '%cultura',
    path:
      '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/detalhes'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/editar': {
    name: 'Editar'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios': {
    name: 'Relatórios Técnicos'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios/[actionId]/detalhes': {
    name: 'Relatório'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]': {
    name: '%talhao',
    path:
      '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/detalhes'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/[fieldId]/editar': {
    name: 'Editar'
  },
  '/admin/users/[userId]/tecnico/propriedades/[id]/talhoes/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/tecnicos': {
    name: 'Técnicos Relacionados'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/tecnicos/solicitacoes': {
    name: 'Solicitações'
  },

  '/admin/users/[userId]/tecnico/propriedades/[id]/tecnicos/solicitacoes/cadastrar': {
    name: 'Solicitar'
  }
};

const adminPropertyRoute = {
  '/admin/propriedades/[id]': {
    name: '%propriedade',
    path: '/admin/propriedades/[id]/detalhes'
  },
  '/admin/propriedades/[id]/documentos/[docId]/editar': {
    name: 'Editar Documento'
  },
  '/admin/propriedades/[id]/documentos/cadastrar': {
    name: 'Cadastrar Documento'
  },
  '/admin/propriedades/[id]/editar': { name: 'Editar' },
  '/admin/propriedades/[id]/talhoes': { name: 'Talhões' },
  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas': { name: 'Culturas' },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes': {
    name: 'Ações'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]': {
    name: 'Detalhes',
    path:
      '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/detalhes'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/editar': {
    name: 'Editar'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas': {
    name: 'Colheitas'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]': {
    name: '%data',
    path:
      '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]/detalhes'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]/detalhes/estoque': {
    name: 'Estoque'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]': {
    name: '%cultura',
    path:
      '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/detalhes'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/editar': {
    name: 'Editar'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios': {
    name: 'Relatórios Técnicos'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios/[actionId]/detalhes': {
    name: 'Relatório'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios/cadastrar': {
    name: 'Cadastrar'
  },

  '/admin/propriedades/[id]/talhoes/[fieldId]/culturas/cadastrar': {
    name: 'Cadastrar'
  },
  '/admin/propriedades/[id]/talhoes/[fieldId]': {
    name: '%talhao',
    path: '/admin/propriedades/[id]/talhoes/[fieldId]/detalhes'
  },
  '/admin/propriedades/[id]/talhoes/[fieldId]/editar': { name: 'Editar' },
  '/admin/propriedades/[id]/talhoes/cadastrar': { name: 'Cadastrar' },
  '/admin/propriedades/[id]/tecnicos': { name: 'Técnicos Relacionados' },
  '/admin/propriedades/[id]/tecnicos/solicitacoes': { name: 'Solicitações' },
  '/admin/propriedades/[id]/tecnicos/solicitacoes/cadastrar': {
    name: 'Solicitar'
  }
};

const technicianPropertyRoute = {
  '/tecnico/propriedades/[id]': {
    name: '%propriedade',
    path: '/tecnico/propriedades/[id]/detalhes'
  },
  '/tecnico/propriedades/[id]/documentos/[docId]/editar': {
    name: 'Editar Documento'
  },
  '/tecnico/propriedades/[id]/documentos/cadastrar': {
    name: 'Cadastrar Documento'
  },
  '/tecnico/propriedades/[id]/editar': { name: 'Editar' },
  '/tecnico/propriedades/[id]/talhoes': { name: 'Talhões' },
  '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas': { name: 'Culturas' },

  '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas': {
    name: 'Colheitas'
  },

  '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]': {
    name: '%data',
    path:
      '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]/detalhes'
  },

  '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]/detalhes/estoque': {
    name: 'Estoque'
  },

  '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/cadastrar': {
    name: 'Cadastrar'
  },

  '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]': {
    name: '%cultura',
    path:
      '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/detalhes'
  },

  '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/editar': {
    name: 'Editar'
  },

  '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios': {
    name: 'Relatórios Técnicos'
  },

  '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios/[actionId]/detalhes': {
    name: 'Relatório'
  },

  '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios/cadastrar': {
    name: 'Cadastrar'
  },

  '/tecnico/propriedades/[id]/talhoes/[fieldId]/culturas/cadastrar': {
    name: 'Cadastrar'
  },
  '/tecnico/propriedades/[id]/talhoes/[fieldId]': {
    name: '%talhao',
    path: '/tecnico/propriedades/[id]/talhoes/[fieldId]/detalhes'
  },
  '/tecnico/propriedades/[id]/talhoes/[fieldId]/editar': { name: 'Editar' },
  '/tecnico/propriedades/[id]/talhoes/cadastrar': { name: 'Cadastrar' }
};

const adminUserProducerNotebookRoute = {
  '/admin/users/[userId]': {
    name: '%usuario',
    path: '/admin/users/[userId]'
  },
  '/admin/users/[userId]/caderno-produtor/[id]': {
    name: '%data',
    path: '/admin/users/[userId]/caderno-produtor/[id]/detalhes'
  },
  '/admin/users/[userId]/caderno-produtor/[id]/editar': { name: 'Editar' }
};

const namedSales = {
  '/vendas': {
    name: 'Vendas'
  },
  '/vendas/relatorio': {
    name: 'Relatório'
  },
  '/vendas/[id]': {
    name: '%lote',
    path: '/vendas/[id]/detalhes'
  },
  '/vendas/[id]/etiquetas': {
    name: 'Gerar Etiquetas'
  },
  '/vendas/[id]/etiquetas/caixas/gerar': {
    name: 'Caixas ou Sacarias'
  },
  '/vendas/[id]/etiquetas/produtos/gerar': {
    name: 'Produtos Embalados (sem Informações Nutricionais)'
  },
  '/vendas/[id]/etiquetas/produtos/nutricional/gerar': {
    name: 'Produtos Embalados (com Informações Nutricionais)'
  },
  '/vendas/cadastrar': {
    name: 'Cadastrar'
  },
  '/vendas/distribuidoras': {
    name: 'Distribuidoras'
  },
  '/vendas/distribuidoras/[id]': {
    name: '%distribuidora',
    path: '/vendas/distribuidoras/[id]/detalhes'
  },
  '/vendas/transportadoras': {
    name: 'Transportadoras'
  },
  '/vendas/transportadoras/[id]': {
    name: '%transportadora',
    path: '/vendas/transportadoras/[id]/detalhes'
  },
  '/vendas/transportadoras/[id]/documentos/cadastrar': {
    name: 'Cadastrar Documentos'
  },
  '/vendas/transportadoras/[id]/veiculos/[vehicleId]': {
    name: '%veiculo',
    path: '/vendas/transportadoras/[id]/veiculos/[vehicleId]/detalhes'
  },
  '/vendas/transportadoras/[id]/relatorio': {
    name: 'Relatório'
  }
};

const adminUserSalesRoute = {
  '/admin/users/[id]/vendas': {
    name: 'Vendas'
  },
  '/admin/users/[id]/vendas/relatorio': {
    name: 'Relatório'
  },
  '/admin/users/[id]/vendas/cadastrar': {
    name: 'Cadastrar'
  },
  '/admin/users/[userId]': {
    name: '%usuario',
    path: '/admin/users/[userId]'
  },
  '/admin/users/[userId]/vendas': {
    name: 'Vendas'
  },
  '/admin/users/[userId]/vendas/relatorio': {
    name: 'Relatório'
  },
  '/admin/users/[userId]/vendas/[id]': {
    name: '%lote',
    path: '/admin/users/[userId]/vendas/[id]/detalhes'
  },
  '/admin/users/[userId]/vendas/[id]/etiquetas': {
    name: 'Gerar Etiquetas'
  },
  '/admin/users/[userId]/vendas/[id]/etiquetas/caixas/gerar': {
    name: 'Caixas ou Sacarias'
  },
  '/admin/users/[userId]/vendas/[id]/etiquetas/produtos/gerar': {
    name: 'Produtos Embalados (sem Informações Nutricionais)'
  },
  '/admin/users/[userId]/vendas/[id]/etiquetas/produtos/nutricional/gerar': {
    name: 'Produtos Embalados (com Informações Nutricionais)'
  },
  '/admin/users/[userId]/vendas/cadastrar': {
    name: 'Cadastrar'
  },
  '/admin/users/[userId]/vendas/distribuidoras': {
    name: 'Distribuidoras'
  },
  '/admin/users/[userId]/vendas/distribuidoras/[id]': {
    name: '%distribuidora',
    path: '/admin/users/[userId]/vendas/distribuidoras/[id]/detalhes'
  },
  '/admin/users/[userId]/vendas/transportadoras': {
    name: 'Transportadoras'
  },
  '/admin/users/[userId]/vendas/transportadoras/[id]': {
    name: '%transportadora',
    path: '/admin/users/[userId]/vendas/transportadoras/[id]/detalhes'
  },
  '/admin/users/[userId]/vendas/transportadoras/[id]/documentos/cadastrar': {
    name: 'Cadastrar Documentos'
  },
  '/admin/users/[userId]/vendas/transportadoras/[id]/relatorio': {
    name: 'Relatório'
  },
  '/admin/users/[userId]/vendas/transportadoras/[id]/veiculos/[vehicleId]': {
    name: '%veiculo',
    path:
      '/admin/users/[userId]/vendas/transportadoras/[id]/veiculos/[vehicleId]/detalhes'
  },
  '/admin/vendas': {
    name: 'Vendas'
  },
  '/admin/vendas/[id]': {
    name: '%lote',
    path: '/admin/vendas/[id]/detalhes'
  },
  '/admin/vendas/[id]/etiquetas': {
    name: 'Etiquetas'
  },
  '/admin/vendas/distribuidoras': {
    name: 'Distribuidoras'
  },
  '/admin/vendas/transportadoras': {
    name: 'Transportadoras'
  },
  '/admin/vendas/[id]/etiquetas/caixas/gerar': {
    name: 'Caixas ou Sacarias'
  },
  '/admin/vendas/[id]/etiquetas/produtos/gerar': {
    name: 'Produtos Embalados (sem Informações Nutricionais)'
  },
  '/admin/vendas/[id]/etiquetas/produtos/nutricional/gerar': {
    name: 'Produtos Embalados (com Informações Nutricionais)'
  },
  '/admin/vendas/distribuidoras/[id]': {
    name: '%distribuidora',
    path: '/admin/vendas/distribuidoras/[id]/detalhes'
  },
  '/admin/vendas/transportadoras/[id]': {
    name: '%transportadora',
    path: '/admin/vendas/transportadoras/[id]/detalhes'
  }
};

const chartRoutes = {
  '/admin/receitas-despesas': {
    name: 'Receitas e Despesas'
  },
  '/admin/projecao-colheita': {
    name: 'Projeção das Colheitas'
  },
  '/admin/users/[id]/receitas-despesas': {
    name: 'Receitas e Despesas'
  },
  '/admin/users/[id]/projecao-colheita': {
    name: 'Projeção das Colheitas'
  },
  '/painel-controle': {
    name: 'Painel de Controle'
  },
  '/painel-controle/projecao-colheita': {
    name: 'Projeção das Colheitas'
  },
  '/painel-controle/receitas-despesas': {
    name: 'Receitas e Despesas'
  }
};

const actionsRoutes = {
  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/acoes': {
    name: 'Ações'
  },
  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]': {
    name: 'Detalhes',
    path:
      '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]/detalhes'
  },
  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]/editar': {
    name: 'Editar'
  },
  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/acoes/cadastrar': {
    name: 'Cadastrar'
  },
  '/admin/propriedades/[id]/talhoes/[fieldId]/acoes': {
    name: 'Ações'
  },
  '/admin/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]': {
    name: 'Detalhes',
    path:
      '/admin/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]/detalhes'
  },
  '/admin/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]/editar': {
    name: 'Editar'
  },
  '/admin/propriedades/[id]/talhoes/[fieldId]/acoes/cadastrar': {
    name: 'Cadastrar'
  },
  '/propriedades/[id]/talhoes/[fieldId]/acoes': {
    name: 'Ações'
  },
  '/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]/detalhes': {
    name: 'Detalhes'
  },
  '/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]/editar': {
    name: 'Editar'
  },
  '/propriedades/[id]/talhoes/[fieldId]/acoes/cadastrar': {
    name: 'Cadastrar'
  },
  '/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]/documentos': {
    name: 'Documentos',
    path:
      '/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]/detalhes'
  },
  '/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]/documentos/cadastrar': {
    name: 'Cadastrar Documento'
  },
  '/propriedades/[id]/talhoes/[fieldId]/acoes/[typeAction]/[actionId]/documentos/[docId]/editar': {
    name: 'Editar Documento'
  },
  '/admin/users/[userId]/propriedades/[id]/acoes': {
    name: 'Ações'
  },
  '/admin/users/[userId]/propriedades/[id]/acoes/[typeAction]/[actionId]': {
    name: 'Detalhes',
    path:
      '/admin/users/[userId]/propriedades/[id]/acoes/[typeAction]/[actionId]/detalhes'
  },
  '/admin/users/[userId]/propriedades/[id]/acoes/[typeAction]/[actionId]/editar': {
    name: 'Editar'
  },
  '/admin/users/[userId]/propriedades/[id]/acoes/cadastrar': {
    name: 'Cadastrar'
  },
  '/admin/propriedades/[id]/acoes': {
    name: 'Ações'
  },
  '/admin/propriedades/[id]/acoes/[typeAction]/[actionId]': {
    name: 'Detalhes',
    path: '/admin/propriedades/[id]/acoes/[typeAction]/[actionId]/detalhes'
  },
  '/admin/propriedades/[id]/acoes/[typeAction]/[actionId]/editar': {
    name: 'Editar'
  },
  '/admin/propriedades/[id]/acoes/cadastrar': {
    name: 'Cadastrar'
  },
  '/propriedades/[id]/acoes': {
    name: 'Ações'
  },
  '/propriedades/[id]/acoes/[typeAction]/[actionId]/detalhes': {
    name: 'Detalhes'
  },
  '/propriedades/[id]/acoes/[typeAction]/[actionId]/editar': {
    name: 'Editar'
  },
  '/propriedades/[id]/acoes/cadastrar': {
    name: 'Cadastrar'
  },
  '/propriedades/[id]/acoes/[typeAction]/[actionId]/documentos': {
    name: 'Documentos',
    path: '/propriedades/[id]/acoes/[typeAction]/[actionId]/detalhes'
  },
  '/propriedades/[id]/acoes/[typeAction]/[actionId]/documentos/cadastrar': {
    name: 'Cadastrar Documento'
  },
  '/propriedades/[id]/acoes/[typeAction]/[actionId]/documentos/[docId]/editar': {
    name: 'Editar Documento'
  },
  '/admin/users/[userId]/propriedades/[id]/talhoes/[fieldId]/relatorio': {
    name: 'Relatório'
  },
  '/propriedades/[id]/talhoes/[fieldId]/relatorio': {
    name: 'Relatório'
  },
  '/admin/users/[userId]/propriedades/[id]/relatorio': {
    name: 'Relatório'
  },
  '/propriedades/[id]/relatorio': {
    name: 'Relatório'
  }
};

const namedRoutes = {
  '/admin': { name: 'Painel Administrativo' },
  '/admin/categorias': { name: 'Categorias' },
  '/admin/categorias/[id]': {
    name: '%categoria',
    path: '/admin/categorias/[id]/detalhes'
  },
  '/admin/categorias/[id]/editar': { name: 'Editar' },
  '/admin/categorias/cadastrar': { name: 'Cadastrar' },
  '/admin/cores': { name: 'Cores' },
  '/admin/cores/[id]': { name: '%cor', path: '/admin/cores/[id]/detalhes' },
  '/admin/cores/[id]/editar': { name: 'Editar' },
  '/admin/cores/cadastrar': { name: 'Cadastrar' },
  '/admin/produtos': { name: 'Produtos' },
  '/admin/produtos/[id]': {
    name: '%produto',
    path: '/admin/produtos/[id]/detalhes'
  },
  '/admin/produtos/[id]/editar': { name: 'Editar' },
  '/admin/produtos/cadastrar': { name: 'Cadastrar' },
  '/admin/propriedades': { name: 'Propriedades' },
  '/admin/users': { name: 'Usuários' },
  '/admin/users/[id]': { name: '%usuario', path: '/admin/users/[id]' },
  '/admin/users/[id]/caderno-produtor': { name: 'Caderno do Produtor' },
  '/admin/users/[id]/caderno-produtor/cadastrar': { name: 'Anotação' },
  '/admin/users/[id]/editar': { name: 'Editar Dados' },
  '/admin/users/[id]/editar/senha': { name: 'Alterar Senha' },
  '/admin/users/[id]/editar/perfil': { name: 'Editar Perfil Público' },
  '/admin/users/[id]/propriedades': { name: 'Propriedades' },
  '/admin/users/[id]/propriedades/cadastrar': { name: 'Cadastrar' },
  '/admin/users/[id]/tecnico': { name: 'Técnico' },
  '/admin/users/[id]/tecnico/propriedades': {
    name: 'Propriedades Relacionadas'
  },
  '/admin/users/[id]/tecnico/solicitacoes': { name: 'Solicitações Técnica' },
  '/admin/users/cadastrar': { name: 'Cadastrar' },
  '/caderno-produtor': { name: 'Caderno do Produtor' },
  '/caderno-produtor/[id]': {
    name: '%data',
    path: '/caderno-produtor/[id]/detalhes'
  },
  '/caderno-produtor/[id]/editar': { name: 'Editar' },
  '/caderno-produtor/cadastrar': { name: 'Anotação' },
  '/configuracoes': { name: 'Configurações' },
  '/configuracoes/editar': { name: 'Editar meus Dados' },
  '/configuracoes/senha': { name: 'Alterar Senha' },
  '/configuracoes/perfil': { name: 'Perfil Público' },
  '/configuracoes/perfil/editar': { name: 'Editar' },
  '/propriedades': { name: 'Propriedades' },
  '/propriedades/[id]': {
    name: '%propriedade',
    path: '/propriedades/[id]/detalhes'
  },
  '/propriedades/[id]/documentos/[docId]/editar': { name: 'Editar Documento' },
  '/propriedades/[id]/documentos/cadastrar': { name: 'Cadastrar Documento' },
  '/propriedades/[id]/editar': { name: 'Editar' },
  '/propriedades/[id]/talhoes': { name: 'Talhões' },
  '/propriedades/[id]/talhoes/[fieldId]': {
    name: '%talhao',
    path: '/propriedades/[id]/talhoes/[fieldId]/detalhes'
  },
  '/propriedades/[id]/talhoes/[fieldId]/culturas': { name: 'Culturas' },
  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes': {
    name: 'Ações'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/detalhes': {
    name: 'Detalhes'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/editar': {
    name: 'Editar'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/cadastrar': {
    name: 'Cadastrar'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/documentos': {
    name: 'Documentos',
    path:
      '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/detalhes'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/documentos/cadastrar': {
    name: 'Cadastrar Documento'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/acoes/[typeAction]/[actionId]/documentos/[docId]/editar': {
    name: 'Editar Documento'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas': {
    name: 'Colheitas'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]': {
    name: '%data',
    path:
      '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]/detalhes'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/[harvestId]/detalhes/estoque': {
    name: 'Estoque'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/colheitas/cadastrar': {
    name: 'Cadastrar'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]': {
    name: '%cultura',
    path: '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/detalhes'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorio': {
    name: 'Relatório'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/editar': {
    name: 'Editar'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios': {
    name: 'Relatórios Técnicos'
  },

  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios/[actionId]/detalhes': {
    name: 'Relatório'
  },
  '/propriedades/[id]/talhoes/[fieldId]/culturas/[cultureId]/relatorios/cadastrar': {
    name: 'Cadastrar'
  },
  '/propriedades/[id]/talhoes/[fieldId]/culturas/cadastrar': {
    name: 'Cadastrar'
  },
  '/propriedades/[id]/talhoes/[fieldId]/editar': { name: 'Editar' },
  '/propriedades/[id]/talhoes/cadastrar': { name: 'Cadastrar' },
  '/propriedades/[id]/tecnicos': { name: 'Técnicos Relacionados' },
  '/propriedades/[id]/tecnicos/solicitacoes': { name: 'Solicitações' },
  '/propriedades/[id]/tecnicos/solicitacoes/cadastrar': { name: 'Solicitar' },
  '/propriedades/cadastrar': { name: 'Cadastrar' },
  '/tecnico': { name: 'Painel Técnico' },
  '/tecnico/propriedades': { name: 'Propriedades Relacionados' },
  '/tecnico/solicitacoes': { name: 'Solicitações Técnica' },
  ...technicianPropertyRoute,
  ...adminPropertyRoute,
  ...adminUserPropertyRoute,
  ...adminUserProducerNotebookRoute,
  ...adminUserTechPropertyRoute,
  ...namedSales,
  ...adminUserSalesRoute,
  ...chartRoutes,
  ...actionsRoutes
};

export default namedRoutes;
