const tmUi = {
  formulateMsg(msg) {
    return msg.map(
      msg=>typeof msg==='object'?JSON.stringify(arg,null,2):String(arg)
    ).join('\n')
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
      accent: 'error',
      title: title,
      msg: fmsg,
    };
    throw new Error(title+': '+fmsg);
  },
};
