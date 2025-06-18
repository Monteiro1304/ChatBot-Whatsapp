const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

let qrCodeData = null;

// Configuração do WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Evento QR Code - Terminal e Web
client.on('qr', (qr) => {
    // QR Code no terminal
    qrcodeTerminal.generate(qr, { small: true });
    console.log('✅ QR Code gerado no terminal!');

    // QR Code na interface web
    qrcode.toDataURL(qr, (err, url) => {
        qrCodeData = url;
        console.log('✅ QR Code gerado na interface web!');
    });
});

// Evento quando conecta
client.on('ready', () => {
    console.log('🤖 WhatsApp conectado com sucesso!');
    qrCodeData = null;
});

// Responde mensagens
client.on('message', async msg => {
    const texto = msg.body.toLowerCase().trim();

    if (texto.match(/^(menu|oi|olá|ola|bom dia|boa tarde|boa noite|0)$/i)) {
        const contact = await msg.getContact();
        const nome = contact.pushname || 'Cliente';

        let resposta = `Olá *${nome}*, sou o assistente virtual da *StarVisa Corretora*! Como posso te ajudar hoje?\n\n`;
        resposta += 'Digite o número da opção desejada:\n';
        resposta += '1️⃣ Seguro Auto\n';
        resposta += '2️⃣ Seguro Vida\n';
        resposta += '3️⃣ Plano de Saúde\n';
        resposta += '4️⃣ Seguro de Cargas\n';
        resposta += '5️⃣ Outras dúvidas\n';

        await msg.reply(resposta);
        return;
    }

    switch (texto) {
        case '1':
            await msg.reply(
                '🚗 *Seguro Auto – Starvisa Seguros*\n\n' +
                '✅ Cobertura: colisão, incêndio, roubo e furto.\n' +
                '✅ Protege passageiros e terceiros.\n' +
                '🛠️ *Benefícios*\n\n' +
                '- Guincho 24h (Brasil e Mercosul)\n' +
                '- Carro reserva\n' +
                '- Desconto na franquia\n' +
                '- Proteção para vidros, faróis e lanternas\n' +
                '- Motorista da vez\n' +
                '- Concierge para sinistros\n' +
                '- Cartório VIP (SP e RJ)\n' +
                '- Rede de oficinas premium e consultor mecânico\n\n' +
                '💬 *Fale conosco:*\n' +
                '☎️ Telefone: (11) 2387-4606\n' +
                '🔗 https://starvisaseguros.com.br/propostaOnline.html\n\n' +
                'Digite *0* para voltar ao menu principal.'
            );
            return;

        case '2':
            await msg.reply(
                '❤️ *Seguro de Vida – Starvisa Seguros*\n\n' +
                '✅ Proteção financeira para você e sua família.\n' +
                '✅ Indenização em casos de falecimento natural ou acidental.\n' +
                '✅ Cobertura para invalidez por acidente ou doença.\n' +
                '✅ Assistência funeral individual ou familiar.\n' +
                '✅ Antecipação em casos de doenças graves.\n' +
                '✅ Proteção para despesas médicas e hospitalares (opcional).\n' +
                '✅ Flexível: você escolhe o valor e quem serão os beneficiários.\n' +
                '✅ Valor acessível e contratação rápida.\n\n' +
                '💬 *Fale conosco:*\n' +
                '☎️ Telefone: (11) 2387-4606\n' +
                '🔗 https://starvisaseguros.com.br/propostaOnline.html\n\n' +
                'Digite *0* para voltar ao menu principal.'
            );
            return;

        case '3':
            await msg.reply(
                '🏥 *Plano de Saúde – Starvisa Seguros*\n\n' +
                '✅ Atendimento médico, hospitalar e laboratorial.\n' +
                '✅ Consultas, exames, internações e cirurgias.\n' +
                '✅ Cobertura de urgência e emergência.\n' +
                '✅ Planos individuais, familiares e empresariais.\n' +
                '✅ Rede credenciada com hospitais, clínicas e laboratórios renomados.\n' +
                '✅ Cobertura nacional ou regional, conforme sua necessidade.\n' +
                '✅ Opções com ou sem coparticipação.\n' +
                '✅ Contratação simples, rápida e sem burocracia.\n\n' +
                '💬 *Fale conosco:*\n' +
                '☎️ Telefone: (11) 2387-4606\n' +
                '🔗 https://starvisaseguros.com.br/propostaOnline.html\n\n' +
                'Digite *0* para voltar ao menu principal.'
            );
            return;

        case '4':
            await msg.reply(
                '🚛 *Seguro de Cargas – Starvisa Seguros*\n\n' +
                '✅ Proteção para cargas durante transporte rodoviário, aéreo ou marítimo.\n' +
                '✅ Cobertura contra roubo, furto, acidentes, avarias e danos à mercadoria.\n' +
                '✅ Atende transportadoras, embarcadores e motoristas autônomos.\n' +
                '✅ Cobertura nacional e internacional.\n' +
                '✅ Assistência 24h em caso de sinistro.\n' +
                '✅ Personalização de acordo com o tipo de carga e rota.\n' +
                '✅ Segurança jurídica e financeira nas operações de transporte.\n\n' +
                '💬 *Fale conosco:*\n' +
                '☎️ Telefone: (11) 2387-4606\n' +
                '🔗 https://starvisaseguros.com.br/propostaOnline.html\n\n' +
                'Digite *0* para voltar ao menu principal.'
            );
            return;

        case '5':
            await msg.reply(
                '❓ *Outras dúvidas*\n\n' +
                'Acesse nosso site para mais informações ou fale diretamente com um atendente:\n' +
                '🔗 https://starvisaseguros.com.br\n\n' +
                '💬 *Fale conosco:*\n' +
                '☎️ Telefone: (11) 2387-4606\n\n' +
                'Digite *0* para voltar ao menu principal.'
            );
            return;
    }

    // Palavras-chave alternativas
    if (texto.includes('seguro auto')) {
        await msg.reply('Por favor, digite *1* para informações sobre Seguro Auto.');
        return;
    }
    if (texto.includes('seguro vida')) {
        await msg.reply('Por favor, digite *2* para informações sobre Seguro Vida.');
        return;
    }
    if (texto.includes('plano de saúde')) {
        await msg.reply('Por favor, digite *3* para informações sobre Plano de Saúde.');
        return;
    }
    if (texto.includes('seguro de cargas')) {
        await msg.reply('Por favor, digite *4* para informações sobre Seguro de Cargas.');
        return;
    }
    if (texto.includes('outras dúvidas')) {
        await msg.reply('Por favor, digite *5* para outras dúvidas.');
        return;
    }
});

// Rota Web - Exibir QR Code no navegador
app.get('/', (req, res) => {
    if (qrCodeData) {
        res.send(`
            <div style="text-align:center;">
                <h1>🤖 Escaneie o QR Code para conectar no WhatsApp</h1>
                <img src="${qrCodeData}" style="width:300px;"/>
                <p>Após escanear, atualize esta página.</p>
            </div>
        `);
    } else {
        res.send('<h1>✅ WhatsApp conectado!</h1>');
    }
});

// Rota para logout e apagar sessão
app.get('/logout', async (req, res) => {
    try {
        await client.logout();
        fs.rmSync('./.wwebjs_auth', { recursive: true, force: true });
        res.send('🗑️ Sessão apagada. Atualize a página para gerar novo QR Code.');
        console.log('🗑️ Sessão apagada.');
    } catch (error) {
        res.send('❌ Erro ao apagar sessão.');
        console.error('❌ Erro ao apagar sessão:', error);
    }
});

// Inicia servidor Express
app.listen(port, () => {
    console.log(`🌐 Servidor rodando na porta ${port}`);
});

// Inicializa WhatsApp
client.initialize();

