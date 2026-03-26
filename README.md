# atv1-bea-it

Atividade 1 do curso de Back-end Avancado da iTalents.

Este projeto implementa um sistema de loja em TypeScript com interface via terminal para controle de produtos, clientes e vendas.

## Objetivo

Simular uma operacao basica de loja com:

- Cadastro de produtos (pereciveis e nao pereciveis)
- Controle de estoque
- Cadastro de clientes
- Registro de vendas com multiplos itens
- Consulta de vendas e detalhamento com lucro

## Funcionalidades

- Cadastrar produto nao perecivel
- Cadastrar produto perecivel com data de validade
- Listar todos os produtos
- Listar produtos disponiveis em estoque
- Listar produtos esgotados
- Aumentar quantidade em estoque de um produto
- Excluir produto
- Cadastrar cliente
- Listar clientes cadastrados
- Cadastrar venda para um cliente
- Listar todas as vendas
- Buscar vendas por nome do cliente
- Exibir detalhes de uma venda (itens, total e lucro)

## Requisitos

- Node.js 18+
- npm 9+

## Tecnologias

- TypeScript
- Node.js
- prompt-sync (entrada de dados no terminal)
- ts-node (execucao direta de TypeScript em desenvolvimento)

## Instalacao

```bash
npm install
```

## Como executar

1. Desenvolvimento (sem compilar manualmente):

```bash
npm run dev
```

2. Execucao compilada:

```bash
npm run build
npm run start
```

Equivalente direto ao script de desenvolvimento:

```bash
npx ts-node main.ts
```

## Menu principal

Ao iniciar, o sistema apresenta as opcoes:

1. Cadastrar produto
2. Listar todos os produtos
3. Listar produtos disponiveis em estoque
4. Listar produtos esgotados
5. Aumentar quantidade de um produto
6. Cadastrar cliente
7. Listar clientes cadastrados
8. Cadastrar venda
9. Listar todas as vendas
10. Procurar vendas por nome do cliente
11. Detalhar venda
12. Excluir produto
0. Sair

## Estrutura do projeto

- `main.ts`: ponto de entrada da aplicacao e menu interativo
- `SistemaLoja.ts`: regras de negocio para produtos, clientes e vendas
- `Produto.ts`: classe abstrata `Produto` e tipos derivados (`ProdutoPerecivel` e `ProdutoNaoPerecivel`)
- `Cliente.ts`: entidade cliente
- `Venda.ts`: entidades `ItemVenda` e `Venda` (totais e lucro)
- `tsconfig.json`: configuracao do compilador TypeScript

## Regras de negocio importantes

- Nao permite cadastro de valores numericos invalidos
- Nao permite venda sem itens
- Nao permite venda para cliente inexistente
- Nao permite venda de produto inexistente
- Nao permite venda acima do estoque disponivel
- Estoque e atualizado automaticamente apos a venda
- Campos de texto nao aceitam entrada vazia

## Licenca

[MIT](https://choosealicense.com/licenses/mit/)
