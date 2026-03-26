import { Cliente } from "./Cliente";
import { Produto, ProdutoNaoPerecivel, ProdutoPerecivel } from "./Produto";
import { ItemVenda, Venda } from "./Venda";

// Centraliza as regras de negocio de produtos, clientes e vendas.
export class SistemaLoja {
	private produtos: Produto[] = [];
	private clientes: Cliente[] = [];
	private vendas: Venda[] = [];
	private proximoIdProduto = 1;
	private proximoIdCliente = 1;
	private proximoIdVenda = 1;

	// Cadastra um produto nao perecivel e adiciona a lista de produtos.
	cadastrarProdutoNaoPerecivel(
		nome: string,
		precoCompra: number,
		precoVenda: number,
		quantidadeEstoque: number
	): ProdutoNaoPerecivel {
		const produto = new ProdutoNaoPerecivel(
			this.proximoIdProduto++,
			nome,
			precoCompra,
			precoVenda,
			quantidadeEstoque
		);
		this.produtos.push(produto);
		return produto;
	}

	// Cadastra um produto perecivel e adiciona a lista de produtos.
	cadastrarProdutoPerecivel(
		nome: string,
		precoCompra: number,
		precoVenda: number,
		quantidadeEstoque: number,
		dataValidade: Date
	): ProdutoPerecivel {
		const produto = new ProdutoPerecivel(
			this.proximoIdProduto++,
			nome,
			precoCompra,
			precoVenda,
			quantidadeEstoque,
			dataValidade
		);
		this.produtos.push(produto);
		return produto;
	}

	listarProdutos(): Produto[] {
		return [...this.produtos];
	}

	listarProdutosDisponiveis(): Produto[] {
		return this.produtos.filter((produto) => produto.quantidadeEstoque > 0);
	}

	listarProdutosEsgotados(): Produto[] {
		return this.produtos.filter((produto) => produto.quantidadeEstoque === 0);
	}

	// Aumenta o estoque de um produto existente, validando a existencia do produto e a quantidade.
	aumentarEstoque(idProduto: number, quantidade: number): void {
		const produto = this.buscarProdutoPorId(idProduto);
		if (!produto) {
			throw new Error("Produto nao encontrado.");
		}
		produto.aumentarEstoque(quantidade);
	}

	// Diminui o estoque de um produto existente, validando a existencia do produto, a quantidade e o estoque disponivel.
	excluirProduto(idProduto: number): void {
		const indice = this.produtos.findIndex((produto) => produto.id === idProduto);
		if (indice === -1) {
			throw new Error("Produto nao encontrado.");
		}
		this.produtos.splice(indice, 1);
	}

	// Cadastra um cliente e adiciona a lista de clientes.
	cadastrarCliente(nome: string, email: string, telefone: string): Cliente {
		const cliente = new Cliente(this.proximoIdCliente++, nome, email, telefone);
		this.clientes.push(cliente);
		return cliente;
	}

	listarClientes(): Cliente[] {
		return [...this.clientes];
	}

	// Cria uma venda validando cliente, itens e estoque antes de efetivar a baixa.
	cadastrarVenda(
		idCliente: number,
		itensSolicitados: { idProduto: number; quantidade: number }[]
	): Venda {
		const cliente = this.buscarClientePorId(idCliente);
		if (!cliente) {
			throw new Error("Cliente nao encontrado.");
		}
		if (itensSolicitados.length === 0) {
			throw new Error("A venda deve ter ao menos um item.");
		}

		const itensVenda: ItemVenda[] = [];

		// Valida itens e prepara a venda sem alterar estoque ainda.
		for (const itemSolicitado of itensSolicitados) {
			if (itemSolicitado.quantidade <= 0) {
				throw new Error("Quantidade de item invalida.");
			}

			const produto = this.buscarProdutoPorId(itemSolicitado.idProduto);
			if (!produto) {
				throw new Error(`Produto ${itemSolicitado.idProduto} nao encontrado.`);
			}
			if (produto.quantidadeEstoque < itemSolicitado.quantidade) {
				throw new Error(
					`Estoque insuficiente para o produto ${produto.nome}. Disponivel: ${produto.quantidadeEstoque}.`
				);
			}

			itensVenda.push(
				new ItemVenda(
					produto,
					itemSolicitado.quantidade,
					produto.precoVenda,
					produto.precoCompra
				)
			);
		}

		// Somente apos validar tudo, baixa o estoque dos produtos vendidos.
		for (const item of itensVenda) {
			item.produto.diminuirEstoque(item.quantidade);
		}

		const venda = new Venda(this.proximoIdVenda++, cliente, itensVenda, new Date());
		this.vendas.push(venda);
		return venda;
	}

	listarVendas(): Venda[] {
		return [...this.vendas];
	}

	// Busca flexivel por nome parcial do cliente, sem diferenciar maiusculas/minusculas.
	buscarVendasPorNomeCliente(nome: string): Venda[] {
		const nomeNormalizado = nome.trim().toLowerCase();
		return this.vendas.filter((venda) =>
			venda.cliente.nome.toLowerCase().includes(nomeNormalizado)
		);
	}

	detalharVenda(idVenda: number): Venda | undefined {
		return this.vendas.find((venda) => venda.id === idVenda);
	}

	private buscarProdutoPorId(idProduto: number): Produto | undefined {
		return this.produtos.find((produto) => produto.id === idProduto);
	}

	private buscarClientePorId(idCliente: number): Cliente | undefined {
		return this.clientes.find((cliente) => cliente.id === idCliente);
	}
}
