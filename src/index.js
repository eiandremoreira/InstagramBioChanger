// Declarando as bibliotecas que vamos utilizar
const Instagram = require('instagram-web-api');
const moment = require('moment');
const { find } = require('weather-js');

// Preencha os campos para fazer o login:
const config = {
	username: 'SEU USUÁRIO (sem o @)',
	password: 'SUA SENHA'
};

// Preencha os campos de acordo com suas informações (será usado para buscar informações sobre a temperatura, acessar sua conta para mudar a bio, etc)
const config_bio = {
	// Exemplo: "Campinas, São Paulo"
	cidade: 'SUA CIDADE',

	meu_nome: 'SEU NOME',
	meu_email: 'SEU_EMAIL'
};

// Declarando o client com seu nome de usuário e senha
const client = new Instagram(config);

// Logando na sua conta
client.login(config).catch((e) => console.log(e));


async function bio () {
	// Pesquisando sua cidade e obtendo as informações do clima
	find({
		search: config_bio.cidade,
		degreeType: 'C'
	}, async function(err, result) {

		// Filtrando a Pesquisa para o primeiro resultado
		let current = result[0].current;

		const data = new Date();
		let data_display = moment(data);
		data_display = moment.locale('pt-br');

		// Isso é opcional, foi feito para subtrair as horas de acordo com o horario aqui em São Paulo, já que esse sistema está rodando numa máquina no exterior (o meu sistema no caso, o seu provavelmente está em um fuso-horário diferente), caso queira remover deixe apenas a função format
		data_display = moment().subtract(3, 'hours').format('lll');

		// Mudando sua bio
		// Caso ocorra algum erro, tente modificar a bio para que não ultrapasse 150 caracteres e não modifique o tempo no loop, deixe em 30min mesmo
		await client.updateProfile({ first_name: config_bio.meu_nome, email: config_bio.meu_email, biography: `🖥️ ${config_bio.meu_nome}\n- Clima em minha cidade (${data_display})\n🌡️・${current.temperature}°C\n🌡️・Sensação Term: ${current.feelslike}°C\n💧・${current.humidity}% de umidade\n🌬️・Vento: ${current.winddisplay}` }).catch((e) => console.log(e));

		console.log(`Bio atualizada com sucesso (${data_display})`);
	}).catch((e) => console.log(e));
}

// Adicionando um loop para mudar a bio de 30 em 30 min
setInterval(async () => bio(), 30 * 60000);

//  Mudando a bio assim que iniciar
bio();

// Feito por @eiandremoreira - 2022