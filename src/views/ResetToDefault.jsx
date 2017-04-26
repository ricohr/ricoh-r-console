//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import ModalFrame from '../components/ModalFrame';
import * as I18N from '../components/i18n';
import MtpActionCreator from '../data/MtpActionCreator';
import * as Utils from '../data/Utils';
import Notify from '../components/Notify';


export default class ResetToDefault extends ModalFrame {
  show() {
    this.refs.modal.show();
  }

  onContinue() {
    const data = Utils.collectValues('factory_default_value');
    (new MtpActionCreator()).applyPropValues(data).then(()=>{
      Notify.showSuccess('propsInitialized');
    });
  }

  render() {
    return (
      <ModalFrame ref='modal' modalId='initializeProps' {...this.props}
        close='label.cancel' continue='label.continue' onContinue={this.onContinue.bind(this)}>
        <I18N.Div data-i18n='initializeProps.confirm'/>
      </ModalFrame>
    );
  }
}
