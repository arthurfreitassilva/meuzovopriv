const { Router } = require("express");
const router = Router();
const discordOauth = require("discord-oauth2");
const oauth = new discordOauth();
const requestIp = require("request-ip");
const axios = require("axios");
const { JsonDatabase } = require("wio.db");
const { EmbedBuilder } = require("discord.js");
const { token } = require("../config.json");
const {
    url,
    clientid,
    secret,
    role,
    guild_id,
    webhook_logs
} = require("../DataBaseJson/configauth.json");

const users = new JsonDatabase({ databasePath: "./DataBaseJson/users.json" });

// Função para calcular o tempo desde a criação da conta
function getTempoDesdeCriacao(dataCriacao) {
    const agora = new Date();
    const criado = new Date(dataCriacao);
    const diff = new Date(agora - criado);

    const anos = diff.getUTCFullYear() - 1970;
    const meses = diff.getUTCMonth();

    let tempo = '';
    if (anos > 0) tempo += `${anos} ano${anos > 1 ? 's' : ''} `;
    if (meses > 0) tempo += `${meses} mês${meses > 1 ? 'es' : ''}`;

    return tempo.trim() || "menos de um mês";
}

// Função para obter a data de criação da conta a partir do ID
function getCreationDate(discordId) {
    const binary = BigInt(discordId).toString(2).padStart(64, '0').slice(0, 42);
    const timestamp = parseInt(binary, 2) + 1420070400000;
    return new Date(timestamp);
}

// Função para detectar SO e navegador a partir do User-Agent
function parseUserAgent(userAgent) {
    const osMatch = userAgent.match(/\(([^)]+)\)/);
    const os = osMatch ? osMatch[1] : "Sistema Desconhecido";

    const browserRegex = /([a-zA-Z]+)\/([0-9.]+)/g;
    let browser = "Navegador Desconhecido";
    let match;
    while ((match = browserRegex.exec(userAgent)) !== null) {
        if (!["Mozilla", "AppleWebKit", "Safari"].includes(match[1])) {
            browser = `${match[1]} ${match[2]}`;
            break;
        }
    }

    return `${os}, ${browser}`;
}

router.get("/auth/callback", async (req, res) => {
    const ip = requestIp.getClientIp(req);
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ message: "Código de autenticação ausente.", status: 400 });
    }

    try {
        // Troca o código pelo token de acesso
        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: clientid,
                client_secret: secret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: `${url}/auth/callback`,
                scope: 'identify guilds.join'
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        const tokenData = tokenResponse.data;

        // Busca dados do usuário
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `${tokenData.token_type} ${tokenData.access_token}`
            }
        });

        const user = userResponse.data;
        const dataCriacao = getCreationDate(user.id);
        const idadeConta = getTempoDesdeCriacao(dataCriacao);
        const userAgent = req.get('User-Agent');
        const dispositivo = parseUserAgent(userAgent);

        // Localização via IP
        let localizacao = 'N/A';
        try {
            const ipInfoResponse = await axios.get(`https://ipinfo.io/${ip}/json`);
            const info = ipInfoResponse.data;
            localizacao = `${info.city || 'Cidade Desconhecida'}, ${info.region || 'Região'}, ${info.country || 'País'}`;
        } catch (ipError) {
            console.error("Erro ao obter localização:", ipError);
            localizacao = 'Não foi possível localizar';
        }

        // Tenta adicionar o usuário ao servidor e atribuir cargo
        try {
            // Adiciona o usuário ao servidor
            await axios.put(
                `https://discord.com/api/v10/guilds/${guild_id}/members/${user.id}`,
                {
                    access_token: tokenData.access_token
                },
                {
                    headers: {
                        Authorization: `Bot ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (addError) {
            console.log("Usuário já está no servidor ou não foi possível adicionar:", addError.response?.data || addError.message);
        }

        // Pega os cargos atuais do membro
        try {
            const memberData = await axios.get(`https://discord.com/api/v10/guilds/${guild_id}/members/${user.id}`, {
                headers: {
                    Authorization: `Bot ${token}`
                }
            });

            const currentRoles = memberData.data.roles;

            // Adiciona o novo cargo sem remover os existentes
            const updatedRoles = [...new Set([...currentRoles, role])];

            await axios.patch(`https://discord.com/api/v10/guilds/${guild_id}/members/${user.id}`, {
                roles: updatedRoles
            }, {
                headers: {
                    Authorization: `Bot ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (roleError) {
            console.error("Erro ao atribuir cargo:", roleError.response?.data || roleError.message);
        }

        // Envia log para o webhook
        try {
            await axios.post(webhook_logs, {
                content: `<@${user.id}>`,
                embeds: [
                    new EmbedBuilder()
                        .setTitle("✅ | Usuário Verificado")
                        .setColor(0x000000)
                        .addFields(
                            { name: "👥 Usuário", value: `<@${user.id}>`, inline: true },
                            { name: "🪐 IP do Usuário", value: `||${ip}||`, inline: true },
                            { name: "📆 Conta Criada", value: `\`há ${idadeConta}\``, inline: true },
                            {
                                name: "🔐 Informações Adicionais",
                                value: `- 🌍 Localização: ${localizacao}\n- 💻 Dispositivo: ${dispositivo}`
                            }
                        )
                        .toJSON()
                ]
            });
        } catch (webhookError) {
            console.error("Erro ao enviar webhook:", webhookError);
        }

        // Salva os dados localmente
        await users.set(user.id, {
            username: user.username,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            code
        });

        // Redireciona após processar tudo
        res.redirect(`https://ghostapi.squareweb.app/`);

    } catch (err) {
        console.error("Erro no processo de autenticação:", err);
        return res.status(500).json({ 
            message: "Ocorreu um erro ao processar a interação. Tente novamente.", 
            status: 500 
        });
    }
});

module.exports = router;
