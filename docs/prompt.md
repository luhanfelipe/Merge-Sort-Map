# Merge Sort Map — Contexto do Projeto

Este documento serve como **prompt inicial** para qualquer IA de assistência (ChatGPT, Claude, Gemini) que for ajudar no desenvolvimento deste projeto. Cole este conteúdo no início da conversa com a IA antes de pedir qualquer código.

---

## 🎯 O que é o projeto

**Merge Sort Map** é um **visualizador interativo** do algoritmo **Merge Sort**, usando um **mapa de cidades** como metáfora visual. Cada cidade tem um nome e uma população, e o algoritmo organiza as cidades em ordem crescente de população. Ao final, uma linha conecta todas as cidades ordenadas.

É um projeto acadêmico da disciplina de **Algoritmos e Estruturas de Dados** do curso de **Tecnologia em Sistemas para Internet (TSI)** do IFPE Campus Igarassu.

## 🎓 O que o professor pediu

Apresentação de **10-15 minutos** sobre **um algoritmo de ordenação**, contendo:

1. **Explicação do algoritmo** — complexidade assintótica, melhor caso, caso médio, pior caso.
2. **Código implementado e explicado** — em qualquer linguagem.
3. **Exemplo passo a passo** da ordenação em um vetor.
4. **Animação** que ilustre o algoritmo em funcionamento.
5. **Comparação** com outros algoritmos.

**Além disso, o professor exigiu uma "pequena aplicação" que usa o algoritmo.** Não precisa ser elaborada como o projeto de listas encadeadas, mas **não pode ser só terminal**.

## 🧱 Stack e arquitetura

- **Backend:** Python 3 + Flask
- **Frontend:** HTML5 + CSS3 + JavaScript puro
- **Comunicação:** Flask expõe rotas REST; JS consome via `fetch` e atualiza a tela.

**Padrão:** o mesmo do projeto anterior **Detonation Dash** (mesmo grupo, mesma disciplina, projeto anterior).

**Estrutura de pastas:**
Merge-Sort-Map/
├── app.py # Flask (servidor)
├── models/
│ ├── init.py
│ └── merge_sort.py # Merge Sort + geração de passos
├── templates/
│ └── index.html # Página do jogo
├── static/
│ ├── css/
│ │ └── estilo.css
│ └── js/
│ ├── mapa.js # Renderização + animação
│ └── api.js # fetch com o Flask
├── docs/
│ └── PROJETO.md # este documento
└── requirements.txt


## 🧠 Como funciona (fluxo)

1. Usuário abre o app no navegador (`localhost:5000`).
2. JS pede ao backend uma lista de cidades geradas aleatoriamente.
3. Backend:
   - Gera N cidades com posições (x, y) e populações aleatórias.
   - Roda o **Merge Sort** e registra **cada passo** (comparações e merges).
   - Devolve em JSON: `{ "cidades": [...], "passos": [...] }`.
4. Frontend desenha as cidades no `<canvas>`.
5. Ao clicar em "Play", o JS percorre os passos e **anima** o mapa:
   - Cidades comparadas ficam destacadas.
   - Cidades se agrupam e se reorganizam.
   - No final, uma **linha** conecta todas em ordem crescente de população.

## 🧾 Formato dos dados

**Cidade:**

{ "id": 1, "nome": "Cidade A", "populacao": 45000, "x": 30, "y": 70 }

Passo (comparação):

json
{ "tipo": "comparar", "a_id": 3, "b_id": 7, "vencedor_id": 3 }
Passo (merge):

json
{ "tipo": "merge", "grupo1_ids": [...], "grupo2_ids": [...], "resultado_ids": [...] }

**📋 Issues do projeto**
O projeto está dividido em 6 issues, que devem ser feitas nessa ordem:

Configurar estrutura inicial do projeto Flask — pastas, arquivos vazios, Flask rodando.
Implementar Merge Sort com registro de passos — models/merge_sort.py.
Criar API Flask — rotas /api/gerar e /api/reiniciar.
Renderizar cidades no mapa — desenhar círculos no <canvas>.
Animar os passos do Merge Sort — botão Play/Pause, passo a passo, slider de velocidade.
Comparação com Bubble Sort — painéis lado a lado (bônus, se der tempo).

**⚠️ Regras pro código**
Comentários em português.

Sem dependências externas além de Flask. Se precisar de algo, avisar antes.

Manter o padrão do Detonation Dash: Flask serve rotas; JS faz o front; Python cuida da lógica.

Não instalar pacotes desnecessários. Se a IA sugerir requests, pandas, numpy ou algo pesado, questione


