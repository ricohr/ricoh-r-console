//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import ModalFrame from '../components/ModalFrame';


export default class About extends ModalFrame {
  show() {
    this.refs.modal.show();
  }

  onClose() {
  }

  render() {
    return (
      <ModalFrame ref='modal' modalId='aboutModal' title='label.about' {...this.props} onClose={this.onClose.bind(this)}>
        <div>Application version <span id='package_version'>{PackageVersion}</span></div>
        <div><span id='mtphelper_version'>{MTPHelperVersion}</span></div>
      </ModalFrame>
    );
  }
}
