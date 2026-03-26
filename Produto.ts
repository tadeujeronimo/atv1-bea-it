// Classe base para os tipos de produto controlados no estoque.
export abstract class Produto {
	constructor(
		public readonly id: number,
		public nome: string,
		public precoCompra: number,
		public precoVenda: number,
		public quantidadeEstoque: number
	) {}

	abstract get tipo(): string;

	// Aumenta estoque apenas com valores positivos.
	aumentarEstoque(quantidade: number): void {
		if (quantidade <= 0) {
			throw new Error("A quantidade deve ser maior que zero.");
		}
		this.quantidadeEstoque += quantidade;
	}

	// Diminui estoque garantindo que nao fique negativo.
	diminuirEstoque(quantidade: number): void {
		if (quantidade <= 0) {
			throw new Error("A quantidade deve ser maior que zero.");
		}
		if (quantidade > this.quantidadeEstoque) {
			throw new Error("Estoque insuficiente para este produto.");
		}
		this.quantidadeEstoque -= quantidade;
	}

	get lucroUnitario(): number {
		return this.precoVenda - this.precoCompra;
	}

	// Gera uma descricao completa do produto, incluindo tipo e precos formatados.
	descricao(): string {
		return [
			`ID: ${this.id}`,
			`Nome: ${this.nome}`,
			`Tipo: ${this.tipo}`,
			`Preco compra: R$ ${this.precoCompra.toFixed(2)}`,
			`Preco venda: R$ ${this.precoVenda.toFixed(2)}`,
			`Estoque: ${this.quantidadeEstoque}`,
		].join(" | ");
	}
}

// Produto sem data de validade.
export class ProdutoNaoPerecivel extends Produto {
	get tipo(): string {
		return "Nao perecivel";
	}
}

// Produto com controle de data de validade.
export class ProdutoPerecivel extends Produto {
	constructor(
		id: number,
		nome: string,
		precoCompra: number,
		precoVenda: number,
		quantidadeEstoque: number,
		public dataValidade: Date
	) {
		super(id, nome, precoCompra, precoVenda, quantidadeEstoque);
	}

	get tipo(): string {
		return "Perecivel";
	}

	override descricao(): string {
		const validade = this.dataValidade.toLocaleDateString("pt-BR");
		return `${super.descricao()} | Validade: ${validade}`;
	}
}
