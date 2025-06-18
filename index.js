const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

let qrCodeData = null;

// ✅ Inicialização do cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// ✅ Evento de geração de QR Code
client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
        qrCodeData = url;
        console.log('🚀 QR Code gerado! Acesse a URL do seu Railway ou localhost para escanear.');
    });
});

// ✅ Evento quando WhatsApp estiver pronto
client.on('ready', () => {
    console.log('✅ WhatsApp conectado!');
    qrCodeData = null;
});

// ✅ Atendimento de mensagens
client.on('message', async msg => {
    const texto = msg.body.toLowerCase().trim();
    const contact = await msg.getContact();
    const nome = contact.pushname || 'Cliente';

    if (texto.match(/^(menu|oi|olá|ola|bom dia|boa tarde|boa noite|0)$/i)) {
        const resposta = 
`Olá *${nome}*, sou o assistente virtual da *StarVisa Corretora*! Como posso te ajudar hoje? 😊

Digite o número da opção desejada:

1️⃣ Seguro Auto 🚗
2️⃣ Seguro Vida ❤️
3️⃣ Plano de Saúde 🏥
4️⃣ Seguro de Cargas 🚛
5️⃣ Outras dúvidas ❓

*Digite 0 para voltar ao menu a qualquer momento.*`;

        await msg.reply(resposta);
        return;
    }

    switch (texto) {
        case '1':
            await msg.reply(
`🚗 *Seguro Auto – Starvisa Seguros*

✅ Cobertura: colisão, incêndio, roubo e furto.
✅ Protege passageiros e terceiros.

🛠️ *Benefícios*:
- Guincho 24h (Brasil e Mercosul)
- Carro reserva
- Desconto na franquia
- Proteção para vidros, faróis e lanternas
- Motorista da vez
- Concierge para sinistros
- Cartório VIP (SP e RJ)
- Rede de oficinas premium e consultor mecânico

💬 *Fale conosco:*
☎️ (11) 2387-4606
🔗 https://starvisaseguros.com.br/propostaOnline.html

Digite *0* para voltar ao menu.`
            );
            return;

        case '2':
            await msg.reply(
`❤️ *Seguro de Vida – Starvisa Seguros*

✅ Proteção financeira para você e sua família.
✅ Indenização em casos de falecimento natural ou acidental.
✅ Cobertura para invalidez por acidente ou doença.
✅ Assistência funeral individual ou familiar.
✅ Antecipação em casos de doenças graves.
✅ Proteção para despesas médicas e hospitalares (opcional).
✅ Flexível: escolha valores e beneficiários.
✅ Valor acessível e contratação rápida.

💬 *Fale conosco:*
☎️ (11) 2387-4606
🔗 https://starvisaseguros.com.br/propostaOnline.html

Digite *0* para voltar ao menu.`
            );
            return;

        case '3':
            await msg.reply(
`🏥 *Plano de Saúde – Starvisa Seguros*

✅ Consultas, exames, internações e cirurgias.
✅ Cobertura de urgência e emergência.
✅ Planos individuais, familiares e empresariais.
✅ Rede credenciada de alta qualidade.
✅ Cobertura nacional ou regional.
✅ Opções com ou sem coparticipação.

💬 *Fale conosco:*
☎️ (11) 2387-4606
🔗 https://starvisaseguros.com.br/propostaOnline.html

Digite *0* para voltar ao menu.`
            );
            return;

        case '4':
            await msg.reply(
`🚛 *Seguro de Cargas – Starvisa Seguros*

✅ Proteção para cargas no transporte rodoviário, aéreo ou marítimo.
✅ Cobertura contra roubo, furto, acidentes, avarias e danos.
✅ Atende transportadoras, embarcadores e autônomos.
✅ Cobertura nacional e internacional.
✅ Assistência 24h em caso de sinistro.
✅ Personalização para cada tipo de carga e rota.

💬 *Fale conosco:*
☎️ (11) 2387-4606
🔗 https://starvisaseguros.com.br/propostaOnline.html

Digite *0* para voltar ao menu.`
            );
            return;

        case '5':
            await msg.reply(
`❓ *Outras dúvidas*

Acesse nosso site ou fale diretamente com um atendente:

🔗 https://starvisaseguros.com.br
☎️ (11) 2387-4606

Digite *0* para voltar ao menu.`
            );
            return;
    }

    // 🔍 Palavras-chave alternativas
    if (texto.includes('seguro auto')) {
        await msg.reply('Digite *1* para informações sobre *Seguro Auto* 🚗');
        return;
    }
    if (texto.includes('seguro vida')) {
        await msg.reply('Digite *2* para informações sobre *Seguro Vida* ❤️');
        return;
    }
    if (texto.includes('plano de saúde')) {
        await msg.reply('Digite *3* para informações sobre *Plano de Saúde* 🏥');
        return;
    }
    if (texto.includes('seguro de cargas')) {
        await msg.reply('Digite *4* para informações sobre *Seguro de Cargas* 🚛');
        return;
    }
    if (texto.includes('outras dúvidas')) {
        await msg.reply('Digite *5* para *outras dúvidas* ❓');
        return;
    }
});

// ✅ Servidor Express para exibir o QR Code no navegador
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

// ✅ Logout - Apagar sessão
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

// ✅ Inicializa o servidor
app.listen(port, () => {
    console.log(`🌐 Servidor rodando na porta ${port}`);
});

client.initialize();
