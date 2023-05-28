const produtosContainer = document.getElementById('produtos-container');
const orcamentoInput = document.getElementById('orcamento-input');
const gerenciarEstoqueBtn = document.getElementById('gerenciar-estoque-btn');
const resultadoContainer = document.getElementById('resultado-container');

let produtoId = 0;

function criarProdutoInput() {
    produtoId++;

    const produtoInput = document.createElement('div');
    produtoInput.classList.add('produto-input');
    produtoInput.dataset.id = produtoId;

    produtoInput.innerHTML = `
        <input type="text" class="nome-input" placeholder="Nome do Produto">
        <input type="number" class="custo-input" placeholder="Custo">
        <input type="number" class="quantidade-input" placeholder="Quantidade Disponível">
        <input type="number" class="demanda-input" placeholder="Demanda Esperada">
    `;

    return produtoInput;
}

function obterDadosProdutos() {
    const produtosInputs = document.getElementsByClassName('produto-input');
    const produtos = [];

    for (const produtoInput of produtosInputs) {
        const nome = produtoInput.querySelector('.nome-input').value;
        const custo = parseFloat(produtoInput.querySelector('.custo-input').value);
        const quantidadeDisponivel = parseInt(produtoInput.querySelector('.quantidade-input').value);
        const demandaEsperada = parseInt(produtoInput.querySelector('.demanda-input').value);

        if (nome && custo && quantidadeDisponivel && demandaEsperada) {
            produtos.push({ nome, custo, quantidade_disponivel: quantidadeDisponivel, demanda_esperada: demandaEsperada });
        }
    }

    return produtos;
}

function mostrarResultado(estoqueFinal, custoTotal) {
    resultadoContainer.innerHTML = '';

    if (estoqueFinal.length === 0) {
        resultadoContainer.textContent = 'Nenhum produto a ser adquirido e mantido em estoque.';
        return;
    }

    const table = document.createElement('table');

    const tableHead = document.createElement('thead');
    tableHead.innerHTML = `
        <tr>
            <th>Produto</th>
            <th>Quantidade</th>
        </tr>
    `;
    table.appendChild(tableHead);

    const tableBody = document.createElement('tbody');
    for (const produto of estoqueFinal) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${produto[0]}</td>
            <td>${produto[1]}</td>
        `;
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);

    const custoTotalText = document.createElement('p');
    custoTotalText.textContent = `Custo total da compra: R$${custoTotal.toFixed(2)}`;

    resultadoContainer.appendChild(table);
    resultadoContainer.appendChild(custoTotalText);
}

function gerenciarEstoque() {
    const orcamento = parseFloat(orcamentoInput.value);
    const produtos = obterDadosProdutos();

    if (orcamento && produtos.length > 0) {
        fetch('http://localhost:5000/estoque', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ produtos, orcamento })
        })
            .then(response => response.json())
            .then(data => {
                const estoqueFinal = data.estoque_final;
                const custoTotal = data.custo_total;

                mostrarResultado(estoqueFinal, custoTotal);
            })
            .catch(error => {
                console.error('Ocorreu um erro:', error);
            });
    } else {
        alert('Por favor, preencha o orçamento e pelo menos um produto.');
    }
}

gerenciarEstoqueBtn.addEventListener('click', gerenciarEstoque);

document.getElementById('adicionar-produto-btn').addEventListener('click', () => {
    const produtoInput = criarProdutoInput();
    produtosContainer.appendChild(produtoInput);
});
