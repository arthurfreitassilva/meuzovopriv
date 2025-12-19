const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { configuracao, tickets } = require("../DataBaseJson");
const emojis = require("../DataBaseJson/Emojis.json");
const fs = require('fs');
const moment = require('moment-timezone');

const Emojis = {
    get: (name) => emojis[name] || ""
};

async function CreateTicket(interaction, valor) {
    const Entrega24 = configuracao.get(`Emojis_carrinho`);
    const statusHorario = tickets.get("statushorario");
    const horarioAbertura = tickets.get("horarioAbertura") || `Não configurado`;
    const horarioFechamento = tickets.get("horarioFechamento") || `Contacte o owner para ele configurar`;
    
    // Obter o horário atual em formato HH:mm no fuso horário de São Paulo
    const agora = moment().tz("America/Sao_Paulo");
    const tempoatualtimebr24 = agora.format("HH:mm");

    const embed24 = new EmbedBuilder()
        .setAuthor({ name: 'Sistema De Horario', iconURL: 'https://cdn.discordapp.com/emojis/1262197032458649682.png?size=2048' })
        .setThumbnail('https://cdn.discordapp.com/emojis/1276859740772630612.gif?size=2048')
        .setDescription(`${Emojis.get(`negative_dreamm67`)} **Tickets** só podem ser aberto entre __\`${horarioAbertura}\`__ e __\`${horarioFechamento}\`__ No horario de brasilia`)
        .setFooter({ text: `${interaction.guild.name}`, iconURL: `https://cdn.discordapp.com/emojis/1197546471017427004.png?size=2048` })
        .setTimestamp();

    // Verificar se o horário de atendimento está ativo e se os horários estão configurados
    if (statusHorario && horarioAbertura !== 'Não configurado' && horarioFechamento !== 'Contacte o owner para ele configurar') {
        // Converter os horários para minutos desde meia-noite para comparação correta
        const [horaAtual, minutoAtual] = tempoatualtimebr24.split(':').map(Number);
        const [horaAbertura, minutoAbertura] = horarioAbertura.split(':').map(Number);
        const [horaFechamento, minutoFechamento] = horarioFechamento.split(':').map(Number);
        
        const minutosAtual = horaAtual * 60 + minutoAtual;
        const minutosAbertura = horaAbertura * 60 + minutoAbertura;
        const minutosFechamento = horaFechamento * 60 + minutoFechamento;
        
        // Verificar se está fora do horário de atendimento
        let dentroDoHorario = false;
        
        if (minutosAbertura <= minutosFechamento) {
            // Horário normal (ex: 08:00 às 18:00)
            dentroDoHorario = minutosAtual >= minutosAbertura && minutosAtual <= minutosFechamento;
        } else {
            // Horário que atravessa meia-noite (ex: 22:00 às 02:00)
            dentroDoHorario = minutosAtual >= minutosAbertura || minutosAtual <= minutosFechamento;
        }
        
        if (!dentroDoHorario) {
            return interaction.reply({
                content: `${interaction.user}`,
                embeds: [embed24],
                ephemeral: true
            });
        }
    }

    let msg = ``;
    if (Entrega24 !== null) {
        Entrega24.sort((a, b) => {
            const numA = parseInt(a.name.replace('ea', ''), 10);
            const numB = parseInt(b.name.replace('ea', ''), 10);
            return numA - numB;
        });

        Entrega24.forEach(element => {
            msg += `<a:${element.name}:${element.id}>`;
        });
    }

    await interaction.reply({ content: `${Emojis.get('loading_dreamapps')} | Aguarde estamos criando seu Ticket!`, ephemeral: true });

    const ticketFunction = tickets.get(`tickets.funcoes.${valor}`);
    const appearance = tickets.get(`tickets.aparencia`);

    if (!ticketFunction || Object.keys(ticketFunction).length === 0) {
        return interaction.editReply({ content: `${Emojis.get('negative_dreamm67')} | Essa função não existe!`, ephemeral: true });
    }

    const existingThread = interaction.channel.threads.cache.find(thread => thread.name.includes(interaction.user.id));
    if (existingThread) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setURL(`https://discord.com/channels/${interaction.guild.id}/${existingThread.id}`)
                .setLabel('Ir para o Ticket')
                .setStyle(5)
        );

        return interaction.editReply({ content: `${Emojis.get('negative_dreamm67')} Você já possui um ticket aberto.`, components: [row], ephemeral: true });
    }

    const thread = await interaction.channel.threads.create({
        name: `${valor}・${interaction.user.username}・${interaction.user.id}`,
        type: ChannelType.PrivateThread,
        reason: 'Ticket aberto',
        permissionOverwrites: [
            {
                id: configuracao.get('ConfigRoles.cargoadm'),
                allow: [PermissionFlagsBits.SendMessagesInThreads],
            },
            {
                id: configuracao.get('ConfigRoles.cargosup'),
                allow: [PermissionFlagsBits.SendMessagesInThreads],
            },
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.SendMessagesInThreads],
            },
        ],
    });

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setURL(`https://discord.com/channels/${interaction.guild.id}/${thread.id}`)
            .setLabel('Ir para o Ticket')
            .setStyle(5)
    );

    await interaction.editReply({ content: `${Emojis.get(`positive_dream`)} Ticket criado com sucesso!`, components: [row], ephemeral: true });

    const embed = new EmbedBuilder()
        .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc' : configuracao.get('Cores.Principal')}`)
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTitle(valor)
        .setDescription(ticketFunction.descricao || ticketFunction.predescricao)
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    if (ticketFunction.banner) {
        embed.setImage(ticketFunction.banner);
    }

    if (appearance.color) {
        embed.setColor(appearance.color);
    }

    const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('lembrar123')
            .setLabel('Notificar')
            .setEmoji('1250592230368870420')
            .setStyle(1),
        new ButtonBuilder()
            .setCustomId('assumir')
            .setLabel('Assumir')
            .setEmoji('1246684179505348642')
            .setStyle(3),
        new ButtonBuilder()
            .setCustomId('PainelStaff')
            .setLabel('Painel Staff')
            .setEmoji('1306692310729359381')
            .setStyle(2),
        new ButtonBuilder()
            .setCustomId('deletar')
            .setLabel('Deletar')
            .setEmoji('1178076767567757312')
            .setStyle(4)
    );

    await thread.send({
        components: [actionRow],
        embeds: [embed],
        content: `${interaction.user} ${configuracao.get('ConfigRoles.cargoadm') ? `<@&${configuracao.get('ConfigRoles.cargoadm')}>` : ''} ${configuracao.get('ConfigRoles.cargosup') ? `<@&${configuracao.get('ConfigRoles.cargosup')}>` : ''}`
    });

    try {
        const statsData = JSON.parse(fs.readFileSync('./DataBaseJson/estatisticas.json', 'utf8'));
        const userPurchases = Object.values(statsData).filter(purchase => purchase.userid === interaction.user.id);

        if (userPurchases.length > 0) {
            const groupedPurchases = userPurchases.reduce((acc, purchase) => {
                if (purchase.campo && purchase.id) {
                    if (!acc[purchase.campo]) {
                        acc[purchase.campo] = {
                            quantity: 0,
                            lastPurchaseDate: new Date(0),
                        };
                    }
                    acc[purchase.campo].quantity += purchase.quantidade;
                    const purchaseDate = new Date(purchase.data);
                    if (purchaseDate > acc[purchase.campo].lastPurchaseDate) {
                        acc[purchase.campo].lastPurchaseDate = purchaseDate;
                    }
                }
                return acc;
            }, {});

            const options = Object.keys(groupedPurchases).map(product => {
                const { quantity, lastPurchaseDate } = groupedPurchases[product];
                const formattedDate = `${lastPurchaseDate.getDate()}/${lastPurchaseDate.getMonth() + 1}/${lastPurchaseDate.getFullYear()}`;

                return {
                    label: `${quantity}x ${product}`,
                    value: product,
                    description: `📅 Última compra: ${formattedDate}`,
                    emoji: { id: '1345629550981283912' },
                };
            });

            if (options.length > 0) {
                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('produto_select')
                    .setPlaceholder('Escolha alguma Compra Aqui')
                    .addOptions(options);

                const selectEmbed = new EmbedBuilder()
                    .setColor('#2F3136')
                    .setDescription(`## Compras Encontradas ${Emojis.get('lupa')}\n- Caso o assunto for sobre algum produto que você comprou, escolha a opção abaixo.\n- Caso o ticket não esteja relacionado a um produto adquirido, pode ignorar esse select menu.`);

                const selectRow = new ActionRowBuilder().addComponents(selectMenu);

                const buttonRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('ignorar_select')
                        .setLabel('Ignorar')
                        .setStyle(2) // Estilo secundário (cinza)
                );

                const selectMessage = await thread.send({
                    embeds: [selectEmbed],
                    components: [selectRow, buttonRow],
                });

                const filter = (i) => (i.customId === 'produto_select' || i.customId === 'ignorar_select') && i.user.id === interaction.user.id;
                const collector = thread.createMessageComponentCollector({ filter, time: 600000 });

                collector.on('collect', async (collected) => {
                    if (collected.customId === 'produto_select') {
                        const selectedOption = collected.values[0];
                        const selectedPurchase = userPurchases.find(purchase => purchase.campo === selectedOption);

                        if (selectedPurchase) {
                            const newChannelName = `${selectedPurchase.campo} ・ ${interaction.user.username} ・ ${interaction.user.id}`;
                            await thread.setName(newChannelName);
                            await collected.reply({ content: `O canal foi alterado para o assunto escolhido. Nossa equipe de suporte em breve irá atendê-lo. Agradecemos pela paciência`, ephemeral: false });

                            const messages = await thread.messages.fetch();
                            const selectMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === 'Selecione o Produto');
                            if (selectMessage) {
                                await selectMessage.delete();
                            }
                        } else {
                            await collected.reply({ content: `Não foi possível encontrar a compra correspondente.`, ephemeral: true });
                        }
                    } else if (collected.customId === 'ignorar_select') {
                        await collected.deferUpdate();
                        await selectMessage.delete();
                    }
                });

                collector.on('end', async (collected, reason) => {
                    if (reason === 'time') {
                        await thread.send({ content: 'Você não escolheu nenhuma opção, então a mensagem foi excluída. Aguarde nossa equipe de suporte.' });

                        const messages = await thread.messages.fetch();
                        const selectMessage = messages.find(msg => msg.embeds.length > 0 && msg.embeds[0].title === 'Selecione o Produto');
                        if (selectMessage) {
                            await selectMessage.delete();
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error('Erro ao ler o arquivo de estatísticas:', error);
    }
}

module.exports = {
    CreateTicket
};