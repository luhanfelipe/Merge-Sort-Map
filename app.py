from flask import Flask, jsonify, render_template, request
from models.merge_sort import gerar_cidades, ordenar_com_passos

app = Flask(__name__)


def gerar_resultado(quantidade):
    cidades = gerar_cidades(quantidade)
    cidades_ordenadas, passos = ordenar_com_passos(cidades)

    return {
        "cidades": [cidade.para_dict() for cidade in cidades_ordenadas],
        "passos": passos,
    }

# Rota principal para servir a interface web
@app.route("/")
def index():
    return render_template("index.html")

# Rota para gerar a lista inicial de cidades e os passos da ordenação
@app.route("/api/gerar", methods=["POST"])
def gerar_cidades_route():
    dados = request.get_json() or {}
    quantidade = dados.get("quantidade", 8)

    return jsonify(gerar_resultado(quantidade)), 200

# Rota para reiniciar/gerar um novo conjunto de cidades
@app.route("/api/reiniciar", methods=["POST"])
def reiniciar_cidades():
    dados = request.get_json() or {}
    quantidade = dados.get("quantidade", 8)

    return jsonify(gerar_resultado(quantidade)), 200

if __name__ == "__main__":
    app.run(debug=True)