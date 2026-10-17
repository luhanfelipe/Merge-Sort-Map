// =====================================================
// mapa.js — Renderização e animação do mapa
// =====================================================
// Este arquivo vai conter toda a lógica visual:
//   1. Desenhar as cidades no <canvas>.
//   2. Animar os passos do Merge Sort.
//   3. Controles: Play, Pause, Passo a passo, Velocidade.
//
// Implementação completa: Issue #5 (Animar os passos do Merge Sort).
//
// Funções previstas:
//   - desenharCidades(cidades)
//   - animarPassos(passos)
//   - limparCanvas()
// =====================================================

/**
 * Limpa todo o conteúdo do canvas.
 */
function limparCanvas() {
    const canvas = document.getElementById('mapa');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Desenha as cidades no canvas a partir do array de cidades fornecido.
 * @param {Array} cidades - Lista de objetos de cidades recebidos da API.
 */
function desenharCidades(cidades) {
    const canvas = document.getElementById('mapa');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    limparCanvas();

    if (!cidades || cidades.length === 0) return;

    // Fator de escala para espalhar as cidades no canvas de 900x600
    // (Ajuste esses multiplicadores se as coordenadas do backend forem diferentes)
    const escalaX = canvas.width / 100;  // Ou ajuste multiplicando por ex: cidade.x * 7
    const escalaY = canvas.height / 100;

    cidades.forEach(cidade => {
        // Se as coordenadas no JSON já forem grandes, use apenas cidade.x e cidade.y.
        // Se forem relativas (0 a 100 ou 0 a 1), escalamos assim:
        const x = cidade.x > 100 ? cidade.x : cidade.x * 7 + 50;
        const y = cidade.y > 100 ? cidade.y : cidade.y * 5 + 50;
        
        // Tamanho do círculo proporcional à população
        const raio = Math.max(6, Math.min(22, (cidade.populacao || 50000) / 10000));

        // Desenha o círculo da cidade
        ctx.beginPath();
        ctx.arc(x, y, raio, 0, 2 * Math.PI);
        ctx.fillStyle = '#8b5cf6';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#c4b5fd';
        ctx.stroke();

        // Desenha o nome da cidade acima do círculo
        ctx.font = '12px Segoe UI, sans-serif';
        ctx.fillStyle = '#e8e8e8';
        ctx.textAlign = 'center';
        ctx.fillText(cidade.nome, x, y - raio - 6);
    });
}