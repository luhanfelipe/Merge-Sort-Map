# 🗺️ Merge Sort Map

Visualizador interativo do algoritmo **Merge Sort** usando um mapa de cidades como metáfora. Cada cidade tem uma população, e o algoritmo organiza as cidades em ordem crescente de população, mostrando cada comparação e junção em tempo real.

Projeto da disciplina de **Algoritmos e Estruturas de Dados** do curso de **Tecnologia em Sistemas para Internet (TSI)** do IFPE – Campus Igarassu.

---

## 🎯 Funcionalidades

- Tela inicial com navegação para visualizador e sobre.
- Visualização das cidades como pontos num mapa.
- **Animação do Merge Sort** em tempo real:
  - Setas amarelas durante comparações.
  - Cidades ficam amarelas sendo comparadas.
  - No final, cidades ficam verdes e setas verdes conectam na ordem de população.
- Controles: **Play**, **Pause**, **Passo a passo** e **Reiniciar**.
- Slider de velocidade da animação.
- Dados gerados aleatoriamente a cada execução.
- Tela "Sobre" com avatares e links do GitHub dos integrantes.

---

## 🏗️ Arquitetura

- **Backend:** Python 3 + Flask.
- **Frontend:** HTML5 + CSS3 + JavaScript puro.
- **Modelos:**
  - `Cidade` — nome, população, posição (x, y).
  - `Merge Sort` — recursivo com registro de passos (comparações e merges).
- **Comunicação:** Flask expõe rotas REST; JS consome via `fetch`.

---

## 🚀 Como rodar

### Pré-requisitos
- Python 3.10+
- pip

### 1. Clone o repositório
bash
git clone https://github.com/luhanfelipe/Merge-Sort-Map.git
cd Merge-Sort-Map

### 2. Crie o ambiente virtual
bash
python3 -m venv .venv
source .venv/bin/activate

### 3. Instale as dependências
bash
pip install -r requirements.txt

### 4. Rode a aplicação
bash
python app.py
Acesse em http://localhost:5000.

---

## 🧭 Rotas
- / — Tela inicial.
- /visualizador — Visualizador do Merge Sort.
- /sobre — Informações do projeto e integrantes.
- /api/gerar — (POST) Gera cidades + passos do Merge Sort.
- /api/reiniciar — (POST) Alias para /api/gerar.

---

## 🛠️ Tecnologias
- Python 3
- Flask
- HTML5
- CSS3
- JavaScript

---

## 👥 Integrantes

| Nome | GitHub |
|------|--------|
| Alan Santos | [@alan-santosBS](https://github.com/alan-santosBS) |
| Luhan Felipe | [@luhanfelipe](https://github.com/luhanfelipe) |
| Luísa Vitória | [@luisavmf0](https://github.com/luisavmf0) |
