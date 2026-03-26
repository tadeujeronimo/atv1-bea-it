import promptSync from "prompt-sync";
import { Produto } from "./Produto";
import { Cliente } from "./Cliente";
import { Venda } from "./Venda";
import { SistemaLoja } from "./SistemaLoja";

// Configura leitura de entrada no terminal e instancia do sistema.
const prompt = promptSync({ sigint: true });
const sistema = new SistemaLoja();

// Exibe o menu de opcoes para o usuario.
function exibirMenu(): void {
	console.log("===== CONTROLE DE LOJA =====");
	console.log("1. Cadastrar produto");
	console.log("2. Listar todos os produtos");
	console.log("3. Listar produtos disponiveis em estoque");
	console.log("4. Listar produtos esgotados");
	console.log("5. Aumentar quantidade de um produto");
	console.log("6. Cadastrar cliente");
	console.log("7. Listar clientes cadastrados");
	console.log("8. Cadastrar venda");
	console.log("9. Listar todas as vendas");
	console.log("10. Procurar vendas por nome do cliente");
	console.log("11. Detalhar venda");
	console.log("12. Excluir produto");
	console.log("0. Sair");
}

// Le texto obrigatorio e remove espacos extras.
function pedirTexto(pergunta: string): string {
	const valor = prompt(pergunta).trim();
	if (!valor) {
		throw new Error("Entrada de texto vazia.");
	}
	return valor;
}

// Le numero aceitando virgula ou ponto como separador decimal.
function pedirNumero(pergunta: string): number {
	const bruto = prompt(pergunta).replace(",", ".").trim();
	const valor = Number(bruto);
	if (Number.isNaN(valor)) {
		throw new Error("Valor numerico invalido.");
	}
	return valor;
}

// Le numero maior que zero, validando a entrada e o valor.
function pedirNumeroPositivo(pergunta: string): number {
	const valor = pedirNumero(pergunta);
	if (valor <= 0) {
		throw new Error("O valor deve ser maior que zero.");
	}
	return valor;
}

// Le numero inteiro maior que zero.
function pedirInteiroPositivo(pergunta: string): number {
	const valor = pedirNumeroPositivo(pergunta);
	if (!Number.isInteger(valor)) {
		throw new Error("O valor deve ser inteiro.");
	}
	return valor;
}

// Le numero inteiro maior ou igual a zero.
function pedirInteiroNaoNegativo(pergunta: string): number {
	const valor = pedirNumero(pergunta);
	if (!Number.isInteger(valor) || valor < 0) {
		throw new Error("O valor deve ser um inteiro maior ou igual a zero.");
	}
	return valor;
}

// Converte data no formato brasileiro (dd/mm/aaaa) para Date.
function parseDataBrasileira(texto: string): Date {
	const partes = texto.split("/");
	if (partes.length !== 3) {
		throw new Error("Data invalida. Use dd/mm/aaaa.");
	}

	const dia = Number(partes[0]);
	const mes = Number(partes[1]);
	const ano = Number(partes[2]);
	if (
		!Number.isInteger(dia) ||
		!Number.isInteger(mes) ||
		!Number.isInteger(ano) ||
		dia <= 0 ||
		mes <= 0 ||
		mes > 12 ||
		ano < 1000
	) {
		throw new Error("Data invalida. Use dd/mm/aaaa.");
	}

	// A data e reconstruida para validar casos como 31/02.
	const data = new Date(ano, mes - 1, dia);
	const dataValida =
		data.getFullYear() === ano &&
		data.getMonth() === mes - 1 &&
		data.getDate() === dia;
	if (!dataValida) {
		throw new Error("Data invalida.");
	}

	return data;
}

// Imprime a descricao de cada produto cadastrado.
function imprimirProdutos(produtos: Produto[]): void {
	if (produtos.length === 0) {
		console.log("Nenhum produto encontrado.");
		return;
	}
	for (const produto of produtos) {
		console.log(produto.descricao());
	}
}

// Imprime a descricao de cada cliente cadastrado.
function imprimirClientes(clientes: Cliente[]): void {
	if (clientes.length === 0) {
		console.log("Nenhum cliente cadastrado.");
		return;
	}
	for (const cliente of clientes) {
		console.log(cliente.descricao());
	}
}

// Imprime um resumo de cada venda, mostrando cliente, data e total.
function imprimirVendas(vendas: Venda[]): void {
	if (vendas.length === 0) {
		console.log("Nenhuma venda cadastrada.");
		return;
	}
	for (const venda of vendas) {
		console.log(venda.resumo());
	}
}

// Cadastra produto perecivel ou nao perecivel conforme tipo informado.
function cadastrarProduto(): void {
	const nome = pedirTexto("Nome do produto: ");
	const precoCompra = pedirNumeroPositivo("Preco de compra: ");
	const precoVenda = pedirNumeroPositivo("Preco de venda: ");
	const quantidade = pedirInteiroNaoNegativo("Quantidade inicial em estoque: ");
	const tipo = pedirInteiroPositivo("Tipo (1 - Perecivel | 2 - Nao perecivel): ");

	if (tipo === 1) {
		const validadeTexto = pedirTexto("Data de validade (dd/mm/aaaa): ");
		const validade = parseDataBrasileira(validadeTexto);
		const produto = sistema.cadastrarProdutoPerecivel(
			nome,
			precoCompra,
			precoVenda,
			quantidade,
			validade
		);
		console.log(`Produto perecivel cadastrado com ID ${produto.id}.`);
		return;
	}

	if (tipo === 2) {
		const produto = sistema.cadastrarProdutoNaoPerecivel(
			nome,
			precoCompra,
			precoVenda,
			quantidade
		);
		console.log(`Produto nao perecivel cadastrado com ID ${produto.id}.`);
		return;
	}

	throw new Error("Tipo de produto invalido.");
}

// Cadastra um cliente e adiciona a lista de clientes.
function cadastrarCliente(): void {
	const nome = pedirTexto("Nome: ");
	const email = pedirTexto("Email: ");
	const telefone = pedirTexto("Telefone: ");
	const cliente = sistema.cadastrarCliente(nome, email, telefone);
	console.log(`Cliente cadastrado com ID ${cliente.id}.`);
}

// Monta uma venda com multiplos itens para um cliente.
function cadastrarVenda(): void {
	const idCliente = pedirInteiroPositivo("ID do cliente: ");
	const itens: { idProduto: number; quantidade: number }[] = [];
	let continuar = true;

	while (continuar) {
		const idProduto = pedirInteiroPositivo("ID do produto: ");
		const quantidade = pedirInteiroPositivo("Quantidade: ");
		itens.push({ idProduto, quantidade });
		const resposta = pedirTexto("Deseja adicionar outro item? (s/n): ").toLowerCase();
		continuar = resposta === "s";
	}

	const venda = sistema.cadastrarVenda(idCliente, itens);
	console.log(`Venda #${venda.id} cadastrada. Total: R$ ${venda.totalVenda.toFixed(2)}.`);
}

// Loop principal da aplicacao com tratamento de erros por operacao.
function executar(): void {
	let sair = false;

	while (!sair) {
		exibirMenu();
		console.log("");

		try {
			const opcao = pedirNumero("Escolha uma opcao: ");
			console.log("");

			// Cada caso representa uma operacao de negocio do menu.
			switch (opcao) {
				case 1:
					cadastrarProduto();
					break;
				case 2:
					imprimirProdutos(sistema.listarProdutos());
					break;
				case 3:
					imprimirProdutos(sistema.listarProdutosDisponiveis());
					break;
				case 4:
					imprimirProdutos(sistema.listarProdutosEsgotados());
					break;
				case 5: {
					const idProduto = pedirInteiroPositivo("ID do produto: ");
					const quantidade = pedirInteiroPositivo("Quantidade para adicionar: ");
					sistema.aumentarEstoque(idProduto, quantidade);
					console.log("Estoque atualizado com sucesso.");
					break;
				}
				case 6:
					cadastrarCliente();
					break;
				case 7:
					imprimirClientes(sistema.listarClientes());
					break;
				case 8:
					cadastrarVenda();
					break;
				case 9:
					imprimirVendas(sistema.listarVendas());
					break;
				case 10: {
					const nome = pedirTexto("Digite o nome do cliente: ");
					imprimirVendas(sistema.buscarVendasPorNomeCliente(nome));
					break;
				}
				case 11: {
					const idVenda = pedirInteiroPositivo("ID da venda: ");
					const venda = sistema.detalharVenda(idVenda);
					if (!venda) {
						throw new Error("Venda nao encontrada.");
					}
					console.log(venda.detalhes());
					break;
				}
				case 12: {
					const idProduto = pedirInteiroPositivo("ID do produto para excluir: ");
					sistema.excluirProduto(idProduto);
					console.log("Produto excluido com sucesso.");
					break;
				}
				case 0:
					sair = true;
					break;
				default:
					console.log("Opcao invalida.");
			}
		} catch (erro) {
			const mensagem = erro instanceof Error ? erro.message : "Erro desconhecido.";
			console.log(`Erro: ${mensagem}`);
		}

		console.log("\n----------------------------------------\n");
	}

	console.log("Sistema finalizado.");
}

executar();
