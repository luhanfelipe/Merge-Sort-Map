from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    """Tela inicial com botão 'Iniciar'."""
    return render_template("home.html")


@app.route("/visualizador")
def visualizador():
    """Tela principal do app (mapa + controles)."""
    return render_template("visualizador.html")


@app.route("/sobre")
def sobre():
    """Tela com os integrantes e links do GitHub."""
    return render_template("sobre.html")


# =====================================================
# API (JSON)
# =====================================================

@app.route("/api/gerar", methods=["POST"])
def api_gerar():
    """Gera cidades e passos do Merge Sort."""
    # Implementação na Issue #3 (mantida igual)
    import json
    from flask import request
    from models.merge_sort import gerar_cidades, ordenar_com_passos

    dados = request.get_json()
    quantidade = dados.get("quantidade", 8) if dados else 8

    cidades = gerar_cidades(quantidade)
    cidades_ordenadas, passos = ordenar_com_passos(cidades)

    return {
        "cidades": [c.para_dict() for c in cidades],
        "passos": passos,
    }


@app.route("/api/reiniciar", methods=["POST"])
def api_reiniciar():
    """Reinicia: gera cidades novas."""
    return api_gerar()


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
