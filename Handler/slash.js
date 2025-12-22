const fs = require("fs")
const colors = require("colors")

function csl() {
  console.clear()
}

module.exports = {

  run: (client) => {

    
    const SlashsArray = []

    // Mudança para leitura síncrona para garantir carregamento correto
    const pastas = fs.readdirSync(`././ComandosSlash/`);
    
    pastas.forEach(subpasta => {
      const arquivos = fs.readdirSync(`././ComandosSlash/${subpasta}/`);
      
      arquivos.forEach(arquivo => {
        if (!arquivo.endsWith('.js')) return;
        
        try {
          let cmd = require(`../ComandosSlash/${subpasta}/${arquivo}`);
          if (!cmd.name) return;
          client.slashCommands.set(cmd.name, cmd);
          SlashsArray.push(cmd);
          console.log(`${colors.green(`[✓]`)} Comando ${colors.cyan(cmd.name)} carregado`);
        } catch (error) {
          console.error(`${colors.red(`[ERRO]`)} Falha ao carregar ${arquivo}:`, error.message);
        }
      });
    });

    client.on("ready", async () => {
      csl()
      console.log(`${colors.cyan(`[COMMANDS]`)} ${SlashsArray.length} slash commands foram carregados.\n`);
      try {
        await client.application.commands.set(SlashsArray);
        console.log(`${colors.green(`[✓]`)} Comandos registrados no Discord com sucesso!\n`);
      } catch (error) {
        console.error(`${colors.red(`[ERRO]`)} Falha ao registrar comandos:`, error);
      }
    });
  }
}