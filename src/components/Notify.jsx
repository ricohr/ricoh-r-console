//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import XssFilters from 'xss-filters';


export default class Notify {
  /* show notify
    @IN title    notify title
    @IN message  notify message
    @IN option.i18n_prefix   i18next-prefix for message / default is 'label'
    @IN option.type          notify type ['success', 'warning', 'danger'] / default is 'warning'
    @IN option.*             pass to $.notify
    */
  static show(title, message, option) {
    if (option === undefined) option = {};
    if (option.type === undefined) option.type = 'warning'
    const i18n_prefix = (option.i18n_prefix !== undefined)? option.i18n_prefix: 'label';
    delete option.i18n_prefix;

    if (title) {
      title = `<div data-i18n='notify.${title}'>${XssFilters.inHTMLData(i18next.t('notify.' + title))}</div>`;
    } else {
      title = ''
    }
    option.newest_on_top = true;
    option.delay = (option.type === 'danger')? 0: Notify.disappear_delay;
    option.timer = Notify.disappear_timer;
    option.element = '#notify-container';
    let msg;
    if (message) {
      msg = (i18n_prefix !== null)? i18next.t(i18n_prefix + '.' + message): message;
    } else {
      msg = '';
    }
    $.notify({
      title,
      message: XssFilters.inHTMLData(msg)
    }, option);
  }

  // show SUCCESS notify
  static showSuccess(title, message, option) {
    if (option === undefined) {
      option = {};
    }
    jQuery.extend(option, {type:'success'});
    Notify.show(title, message, option);
  }

  // show DANGER notify
  static showDanger(title, message, option) {
    if (option === undefined) {
      option = {};
    }
    jQuery.extend(option, {type:'danger'});
    Notify.show(title, message, option);
  }
};

Notify.disappear_delay = 3000;
Notify.disappear_timer = 1000;
