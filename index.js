const { Client, LocalAuth, Buttons } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

let qrCodeData = null;

// Cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// Gerar QR Code
client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        qrCodeData = url;
        console.log('🚀 QR Code gerado! Acesse http://localhost:3000 para escanear.');
    });
});

// WhatsApp conectado
client.on('ready', () => {
    console.log('✅ WhatsApp conectado!');
    qrCodeData = null;
});

// Função delay
const delay = ms => new Promise(res => setTimeout(res, ms));

// Rota para exibir QR Code
app.get('/', (req, res) => {
    if (qrCodeData) {
        res.send(`
            <h1>Escaneie o QR Code para conectar no WhatsApp</h1>
            <img src="${qrCodeData}" />
        `);
    } else {
        res.send('<h1>✅ WhatsApp conectado!</h1>');
    }
});

// 🔥 Rota para desconectar manualmente
app.get('/logout', async (req, res) => {
    try {
        const folder = path.join(__dirname, 'session');
        await client.logout();
        fs.rmSync('./.wwebjs_auth', { recursive: true, force: true });
        res.send('🗑️ Sessão apagada. Atualize a página para gerar novo QR Code.');
        console.log('🗑️ Sessão apagada.');
    } catch (error) {
        res.send('❌ Erro ao apagar sessão.');
        console.error('❌ Erro ao apagar sessão:', error);
    }
});

// Ativando o servidor Express
app.listen(port, () => {
    console.log(`🌐 Servidor rodando em http://localhost:${port}`);
});

// 🤖 Chatbot WhatsApp
client.on('message', async msg => {
    const texto = msg.body.toLowerCase();

    if (texto.match(/(menu|oi|olá|ola|bom dia|boa tarde|boa noite)/i)) {
        const contact = await msg.getContact();
        const nome = contact.pushname || 'Cliente';

        const buttons = new Buttons(
            `Olá *${nome}*, sou o assistente virtual da *StarVisa Corretora*! Como posso te ajudar hoje?\n\nEscolha uma opção abaixo:`,
            [
                { body: '🚗 Seguro Auto' },
                { body: '❤️ Seguro Vida' },
                { body: '🏥 Plano de Saúde' },
                { body: '🚚 Seguro de Cargas' },
                { body: '❓ Outras dúvidas' }
            ],
            'Menu Principal',
            'StarVisa Corretora'
        );

        await msg.reply(buttons);
    }

    if (texto.includes('seguro auto')) {
        await msg.reply(
            '*🚗 Seguro Auto*\n\n' +
            '- Coberturas básicas e adicionais.\n' +
            '- Franquias flexíveis.\n\n' +
            '📋 *Como funciona:*\n' +
            '1º Cadastre-se no link.\n' +
            '2º Nossa equipe entrará em contato.\n\n' +
            '🔗 https://starvisaseguros.com.br/propostaOnline.html'
        );
    }

    if (texto.includes('seguro vida')) {
        await msg.reply(
            '*❤️ Seguro de Vida*\n\n' +
            '- Individual: R$22,50/mês.\n' +
            '- Família (você + 3): R$39,90/mês.\n' +
            '- TOP Individual: R$42,50/mês.\n' +
            '- TOP Família: R$79,90/mês.\n\n' +
            '🔗 https://starvisaseguros.com.br/propostaOnline.html'
        );
    }

    if (texto.includes('plano de saúde')) {
        await msg.reply(
            '*🏥 Plano de Saúde*\n\n' +
            '- Sorteios anuais.\n' +
            '- Atendimento 24h.\n' +
            '- Cobertura para medicamentos.\n\n' +
            '🔗 https://starvisaseguros.com.br/propostaOnline.html'
        );
    }

    if (texto.includes('seguro de cargas')) {
        await msg.reply(
            '*🚚 Seguro de Cargas*\n\n' +
            'Cobertura nacional e internacional para diferentes modais: terrestre, aéreo, aquático e ferroviário.\n\n' +
            '🔗 https://starvisaseguros.com.br/propostaOnline.html'
        );
    }

    if (texto.includes('outras dúvidas')) {
        await msg.reply(
            '❓ Para outras dúvidas, fale diretamente com um atendente ou acesse:\n' +
            '🔗 https://starvisaseguros.com.br'
        );
    }
});

// Inicializar o cliente WhatsApp
client.initialize();
