function fAutoLogin(idsfx) {
  // if active checkbox in menu
  if (tmsGet('tm_keep_feature-' + idsfx) === '1') {
    // if correct url
    const regex = /^http:\/\/www.crlaurence\.com\/login$/;
    if (regex.test(window.location.href)) {
      getEl('#loginForm button').click();
    }
  }
}
