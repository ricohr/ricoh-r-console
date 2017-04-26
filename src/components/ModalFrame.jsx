//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import {FormGroup, Col, MenuItem, Button, Modal} from 'react-bootstrap';
import * as I18N from '../components/i18n';


export default class ModalFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  show() {
    this.props.appActions.muteSlider(true);
    this.setState({
      showModal: true
    });
  }

  onClose() {
    this.hide();
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  onContinue() {
    this.hide();
    if (this.props.onContinue) {
      this.props.onContinue();
    }
  }

  hide() {
    this.props.appActions.muteSlider(false);
    this.setState({
      showModal: false
    });
  }

  render() {
    let closeButton;
    switch (this.props.close) {
    case undefined:
      closeButton = (<I18N.Button bsStyle='default' data-i18n='label.close' onClick={this.onClose.bind(this)}/>);
      break;
    case false:
      closeButton = '';
      break;
    default:
      closeButton = (<I18N.Button bsStyle='default' data-i18n={this.props.close} onClick={this.onClose.bind(this)}/>);
      break;
    }
    const continueButton = (this.props.continue)? (
            <I18N.Button bsStyle='default' data-i18n={this.props.continue} onClick={this.onContinue.bind(this)}/>
          ): '',
          titleElement = (this.props.title)? (
            <Modal.Header><I18N.ModalTitle data-i18n={this.props.title}/></Modal.Header>
          ): '';
    return (
      <Modal id={this.props.modalId} show={this.state.showModal} onHide={this.onClose.bind(this)}>
        {titleElement}
        <Modal.Body>
          {this.props.children}
        </Modal.Body>
        <Modal.Footer>
          {closeButton}
          {continueButton}
        </Modal.Footer>
      </Modal>
    );
  }
}
