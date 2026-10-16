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
