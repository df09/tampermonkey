const tmUi = {
  formulateMsg(msg) {
    return msg.map(
      item => typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)
    ).join('\n');
  },

  reset(msg) {
    tmsReset();
    tmMenu.showMain();
  },
  abort({title='tmUi.abort', msg}) {
    const fmsg = this.formulateMsg(msg);
    tmsDeleteAll();
    tmMenu.showMain();
    tmModal.info({
      accent: 'r',
      title: title,
      msg: fmsg,
    });
    throw new Error(title+': '+fmsg);
  },
};
