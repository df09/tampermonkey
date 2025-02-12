function fAutoLogin(idsfx) {
  console.log('fAutoLogin: start..');
  // if active checkbox in menu
  if (tmsGet('tm_keep_feature-' + idsfx) === '1') {
    // if correct url
    const regex = /^https:\/\/www\.crlaurence\.com\/login$/;
    if (regex.test(window.location.href)) {
      getEl('.login-page .visible-lg #loginForm button.button--register').click();
    }
  }
}
