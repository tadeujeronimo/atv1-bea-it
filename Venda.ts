import { Cliente } from "./Cliente";
import { Produto } from "./Produto";

// Item individual de uma venda com preco de compra e de venda no momento da operacao.
export class ItemVenda {
	constructor(
		public produto: Produto,
		public quantidade: number,
		public precoVendaUnitario: number,
		public precoCompraUnitario: number
	) {}

	get subtotalVenda(): number {
		return this.precoVendaUnitario * this.quantidade;
	}

	// Lucro do item = (preco de venda - preco de compra) x quantidade.
	get subtotalLucro(): number {
		return (this.precoVendaUnitario - this.precoCompraUnitario) * this.quantidade;
	}
}

// Agrega cliente, itens e data para representar uma venda completa.
export class Venda {
	constructor(
		public readonly id: number,
		public readonly cliente: Cliente,
		public readonly itens: ItemVenda[],
		public readonly data: Date
	) {}

	get totalVenda(): number {
		return this.itens.reduce((acc, item) => acc + item.subtotalVenda, 0);
	}

	get lucroVenda(): number {
		return this.itens.reduce((acc, item) => acc + item.subtotalLucro, 0);
	}

	resumo(): string {
		return [
			`ID venda: ${this.id}`,
			`Cliente: ${this.cliente.nome}`,
			`Data: ${this.data.toLocaleString("pt-BR")}`,
			`Total: R$ ${this.totalVenda.toFixed(2)}`,
		].join(" | ");
	}

	// Gera um texto detalhado da venda com quebra por item e totais finais.
	detalhes(): string {
		const itensTexto = this.itens
			.map((item) => {
				const subtotal = item.subtotalVenda.toFixed(2);
				return `- ${item.produto.nome} | Qtd: ${item.quantidade} | Unit: R$ ${item.precoVendaUnitario.toFixed(2)} | Subtotal: R$ ${subtotal}`;
			})
			.join("\n");

		return [
			`Detalhes da venda #${this.id}`,
			`Cliente: ${this.cliente.nome}`,
			`Data: ${this.data.toLocaleString("pt-BR")}`,
			"Itens:",
			itensTexto,
			`Total da venda: R$ ${this.totalVenda.toFixed(2)}`,
			`Lucro da venda: R$ ${this.lucroVenda.toFixed(2)}`,
		].join("\n");
	}
}
