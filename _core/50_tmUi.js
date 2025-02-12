const tmUi = {
  formulateMsg(msg) {
    if (!Array.isArray(msg)) {
      return typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg);
    }
    return msg.map(
      item => typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)
    ).join('\n');
  },

  reset() {
    tmsReset();
    tmMenu.showMain();
  },
  abort({title=tmsGetAction(), msg='Abort'}={}) {
    tmsReset();
    tmMenu.showMain();
    const fmsg = this.formulateMsg(msg);
    tmModal.info({ accent: 'r', title: title, msg: fmsg, });
    throw new Error(title + ': ' + fmsg);
  },

  startOperation(operation) {
    tmsSetOperation(operation);
    tmMenu.showExec();
  },
  done({accent='g', title=tmsGetAction(), msg='Done!'}={}) {
    tmsReset(); tmMenu.showMain();
    tmModal.info({accent:accent, title:title, msg:this.formulateMsg(msg)});
  },
};
