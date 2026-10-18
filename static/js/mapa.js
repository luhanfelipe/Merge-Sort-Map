// =====================================================
// mapa.js — Renderização e animação do mapa
// =====================================================

// Variáveis globais do jogo (serão preenchidas ao iniciar)
let cidadesGlobais = [];
let passosGlobais = [];


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
 */
function desenharCidades(cidades) {
    const canvas = document.getElementById('mapa');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    limparCanvas();

    const escalaX = canvas.width / 100;
    const escalaY = canvas.height / 100;

    for (const cidade of cidades) {
        const px = cidade.x * escalaX;
        const py = cidade.y * escalaY;

        // Tamanho do círculo proporcional à população
        const raio = 4 + (cidade.populacao / 100000) * 12;

        // Círculo
        ctx.beginPath();
        ctx.arc(px, py, raio, 0, Math.PI * 2);
        ctx.fillStyle = '#a78bfa';
        ctx.fill();
        ctx.strokeStyle = '#6c63ff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Nome acima
        ctx.fillStyle = '#e8e8e8';
        ctx.font = '12px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(cidade.nome, px, py - raio - 6);
    }
}


/**
 * Inicializa o app: busca cidades do backend e desenha o estado inicial.
 */
async function iniciar() {
    const dados = await buscarCidades(8);

    cidadesGlobais = dados.cidades;
    passosGlobais = dados.passos;

    console.log(`Recebidas ${cidadesGlobais.length} cidades e ${passosGlobais.length} passos.`);

    desenharCidades(cidadesGlobais);
}


// Chama iniciar() quando a página carrega
window.addEventListener('DOMContentLoaded', iniciar);
