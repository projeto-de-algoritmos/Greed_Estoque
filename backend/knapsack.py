class Produto:
    def __init__(self, nome, custo, quantidade_disponivel, demanda_esperada):
        self.nome = nome
        self.custo = custo
        self.quantidade_disponivel = quantidade_disponivel
        self.demanda_esperada = demanda_esperada

    def calcula_relacao_custobeneficio(self):
        return self.demanda_esperada / self.custo


def gerenciar_estoque(produtos, orcamento_disponivel):
    produtos_ordenados = sorted(produtos, key=lambda p: p.calcula_relacao_custobeneficio(), reverse=True)

    estoque_final = []
    custo_total = 0

    for produto in produtos_ordenados:
        quantidade_a_adquirir = min(produto.quantidade_disponivel, orcamento_disponivel // produto.custo)

        if quantidade_a_adquirir > 0:
            estoque_final.append((produto.nome, quantidade_a_adquirir))
            custo_total += produto.custo * quantidade_a_adquirir
            orcamento_disponivel -= produto.custo * quantidade_a_adquirir

    return estoque_final, custo_total
