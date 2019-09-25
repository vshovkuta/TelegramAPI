export class TelegramBotAPI {
  constructor(bot_token) {
    this.resultObject;
    this.messageId = new Set();
    this.bot_token = bot_token;
    this.baseURL = `https://api.telegram.org/bot${this.bot_token}`;

    this.ext_getMessageLog();
    this.ext_autoupdateMessageLog();
  }

  sendMessage(chat_id, message) {
    fetch(`${this.baseURL}/sendMessage?chat_id=${chat_id}&text=${message}`);
  }

  async ext_sendMessageToAll(message) {
    await this.getUpdates();
    this.ext_getUniqueMembersChatId(this.resultObject.result).forEach((item) => this.sendMessage(item, message));
  }

  async getUpdates(allowed_updates = ['message']) {
    return await fetch(`${this.baseURL}/getUpdates?allowed_updates=${allowed_updates}`)
      .then((APIresult) => APIresult.json())
      .then((APIresult) => this.resultObject = APIresult)
  }

  ext_getUniqueMembersChatId(APIresult) {
    return Array.from(new Set(APIresult.map((item) => {
      let messageType = item.message || item['edited_message'];
      return messageType.chat.id;
    })));
  }

  async ext_getMessageLog() {
    await this.getUpdates();

    let logDiv = document.getElementById('message-log');

    this.resultObject.result.forEach((item) => {
      let messageType = item.message || item['edited_message'];

      if (!this.messageId.has(messageType.message_id)) {
        this.messageId.add(messageType.message_id);
        let textDiv = document.createElement('div');
        textDiv.innerText = `#${messageType.message_id} ${messageType.chat.first_name} ${messageType.chat.last_name} (${new Date(messageType.date * 1000).toLocaleString()}): ${messageType.text || 'unsupported content'}\n`;
        logDiv.append(textDiv);
      }
    });
  }

  ext_autoupdateMessageLog(delay = 5) {
    setInterval(() => this.ext_getMessageLog(), delay * 1000);
  }
}
