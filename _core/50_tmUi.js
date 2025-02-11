const tmUi = {
  formulateMsg(msg) {
    if (!Array.isArray(msg)) {
      return typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg);
    }
    return msg.map(
      item => typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)
    ).join('\n');
  },

  reset(msg) {
    tmsReset();
    tmMenu.showMain();
  },
  abort({title=tmsGetAction(), msg='Abort'}={}) {
    const fmsg = this.formulateMsg(msg);
    tmsDeleteAll();
    tmMenu.showMain();
    tmModal.info({ accent: 'r', title: title, msg: fmsg, });
    throw new Error(title + ': ' + fmsg);
  },

  startOperation(operation) {
    tmsSetOperation(operation);
    tmMenu.showExec();
  },
  done({title=tmsGetAction(), msg='Done!'}={}) {
    tmsReset(); tmMenu.showMain();
    tmModal.info({accent:'g', title:title, msg:this.formulateMsg(msg)});
  },
};
