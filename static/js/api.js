// =====================================================
// api.js — Comunicação com o backend Flask
// =====================================================
// Este arquivo vai conter as funções de fetch que
// conversam com as rotas /api/gerar e /api/reiniciar.
//
// Implementação completa: Issue #4 (Renderizar cidades no mapa).
//
// Funções previstas:
//   - buscarCidades() → POST /api/gerar
//                       retorna { cidades: [...], passos: [...] }
// =====================================================

async function buscarCidades() {
    try {
        const response = await fetch('/api/gerar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Envia os parâmetros esperados pelo backend
            body: JSON.stringify({
                qtd: 10,
                quantidade: 10
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        // Retorna a lista de cidades recebida
        return data.cidades || data;
    } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        return [];
    }
}