from flask import Flask, jsonify, request
from flask_cors import CORS
from knapsack import Produto, gerenciar_estoque

app = Flask(__name__)
CORS(app)

@app.route('/estoque', methods=['POST'])
def handle_estoque():
    data = request.get_json()
    produtos = [Produto(p['nome'], p['custo'], p['quantidade_disponivel'], p['demanda_esperada']) for p in data['produtos']]
    orcamento = data['orcamento']
    estoque_final, custo_total = gerenciar_estoque(produtos, orcamento)

    return jsonify({
        'estoque_final': estoque_final,
        'custo_total': custo_total
    })

if __name__ == '__main__':
    import webbrowser

    webbrowser.open_new("http://localhost:3000")
    app.run(host='localhost')

