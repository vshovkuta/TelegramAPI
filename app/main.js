import {TelegramBotAPI} from '../app/TelegramBotAPI.js';

let bot_token = '710233210:AAGOeMFHE_w2NuF9QqGIL_CpFoAr1YY9jGw';
const myBot = new TelegramBotAPI(bot_token);

document.getElementById('message-send').addEventListener('click', () => {
  myBot.ext_sendMessageToAll(document.getElementById('message-value').value);
});
