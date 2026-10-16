# =====================================================
# merge_sort.py — Algoritmo Merge Sort + registro de passos
# =====================================================
# Este arquivo contém:
#   1. A classe Cidade (modelo dos dados).
#   2. A função gerar_cidades(n) (dados aleatórios).
#   3. O Merge Sort com registro de passos.
# =====================================================

import random


class Cidade:
    """Representa uma cidade no mapa.

    Cada cidade tem um nome, uma população e uma posição (x, y) no mapa.
    """

    def __init__(self, id, nome, populacao, x, y):
        self.id = id
        self.nome = nome
        self.populacao = populacao
        self.x = x
        self.y = y

    def para_dict(self):
        """Converte a cidade em um dicionário pronto pra virar JSON."""
        return {
            "id": self.id,
            "nome": self.nome,
            "populacao": self.populacao,
            "x": self.x,
            "y": self.y,
        }

    def __repr__(self):
        return f"Cidade(id={self.id}, nome={self.nome!r}, pop={self.populacao})"


# Lista de nomes fictícios pra dar personalidade às cidades
NOMES_CIDADES = [
    "Vila Nova", "Porto Belo", "Monte Alto", "Campo Verde",
    "Rio Claro", "Serra Azul", "Boa Vista", "Santa Cruz",
    "Vale Fundo", "Pedra Branca", "Alto Paraíso", "Lagoa Seca",
    "Praia Grande", "Fonte Limpa", "Vila Real", "Jardim Novo",
]


def gerar_cidades(n):
    """Gera N cidades com posições e populações aleatórias.

    - A posição (x, y) é sorteada entre 0 e 100.
    - A população é sorteada entre 1.000 e 100.000.
    - Os nomes são únicos (não repete).
    """
    if n > len(NOMES_CIDADES):
        raise ValueError(f"Máximo de {len(NOMES_CIDADES)} cidades suportado.")

    nomes_sorteados = random.sample(NOMES_CIDADES, n)

    cidades = []
    for i, nome in enumerate(nomes_sorteados):
        cidades.append(
            Cidade(
                id=i + 1,
                nome=nome,
                populacao=random.randint(1000, 100000),
                x=random.randint(0, 100),
                y=random.randint(0, 100),
            )
        )

    return cidades

# =====================================================
# PARTE 2: Algoritmo Merge Sort básico (sem passos)
# =====================================================

def _merge_sort(cidades):
    """Merge Sort recursivo. Retorna uma nova lista ordenada por populacao.

    Não registra passos — isso será adicionado na Parte 3.
    """
    if len(cidades) <= 1:
        return cidades

    meio = len(cidades) // 2
    esquerda = _merge_sort(cidades[:meio])
    direita = _merge_sort(cidades[meio:])

    return _merge(esquerda, direita)


def _merge(esquerda, direita):
    """Junta duas listas já ordenadas numa única lista ordenada."""
    resultado = []
    i = 0
    j = 0

    while i < len(esquerda) and j < len(direita):
        if esquerda[i].populacao <= direita[j].populacao:
            resultado.append(esquerda[i])
            i += 1
        else:
            resultado.append(direita[j])
            j += 1

    # Sobras
    while i < len(esquerda):
        resultado.append(esquerda[i])
        i += 1

    while j < len(direita):
        resultado.append(direita[j])
        j += 1

    return resultado


def ordenar(cidades):
    """Função pública: ordena uma lista de cidades por população."""
    return _merge_sort(cidades)
