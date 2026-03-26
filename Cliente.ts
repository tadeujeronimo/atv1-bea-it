// Entidade que representa um cliente da loja.
export class Cliente {
	constructor(
		public readonly id: number,
		public nome: string,
		public email: string,
		public telefone: string
	) {}

	descricao(): string {
		return `ID: ${this.id} | Nome: ${this.nome} | Email: ${this.email} | Telefone: ${this.telefone}`;
	}
}
