// =====================================================
// api.js — Comunicação com o backend Flask
// =====================================================

/**
 * Busca uma lista de cidades e os passos do Merge Sort no backend.
 *
 * @param {number} quantidade — quantas cidades gerar (padrão: 8)
 * @returns {Promise<{cidades: Array, passos: Array}>}
 */
async function buscarCidades(quantidade = 8) {
    try {
        const response = await fetch('/api/gerar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantidade: quantidade }),
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const dados = await response.json();
        return dados;
    } catch (erro) {
        console.error('Falha ao buscar cidades:', erro);
        return { cidades: [], passos: [] };
    }
}
