//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import {FormGroup, Col, ButtonGroup, DropdownButton, MenuItem, Button, Modal} from 'react-bootstrap';
import * as I18N from '../components/i18n';
import MtpActionCreator from '../data/MtpActionCreator';
import PresetActionCreator from '../data/PresetActionCreator';
import Notify from '../components/Notify';

const dateFormat = {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'};


export default class Preset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedPreset: null,
    };
  }

  onToggleDropdown(isOpen) {
    this.props.appActions.muteSlider(isOpen);
  }

  onPresetItemClicked(eventKey, e) {
    const mac = new MtpActionCreator(),
          presetId = eventKey[0],
          label = eventKey[1],
          propValues = this.props.appStore.get('presets').get(presetId).toObject();
    mac.applyPropValues(propValues).then(()=>{
      Notify.showSuccess('presetsLooaded', label, {i18n_prefix:null});
    });
  }

  onPresetSaveClicked() {
    this.props.appActions.muteSlider(true);
    this.setState({
      showModal: true,
      selectedPreset: null
    });
  }

  onModalClose() {
    this.props.appActions.muteSlider(false);
    this.setState({
      showModal: false,
      selectedPreset: null
    });
  }

  onModalContinue() {
    this.onModalClose();
    const presetId = this.state.selectedPreset;
    PresetActionCreator.save(presetId, this.props.appStore).then((err)=>{
      if (!err) {
        Notify.showSuccess('presetsSaved', presetId, {i18n_prefix:'presets'});
      } else {
        Notify.showDanger('presetsSaveFailed', err, {i18n_prefix:null});
      }
    });
  }

  onRadioChanged(e) {
    this.setState({selectedPreset: e.target.value});
  }

  render() {
    const radioStyle = {display: 'none'},
          dropdownItems = [],
          modalItems = [],
          presets = this.props.appStore.get('presets');
    if (presets.isEmpty()) {
      return (<div/>);
    }

    for (const name of presets.keys()) {
      const stamp = presets.get(name).get('_last_updated'),
            label = i18next.t('presets.' + name, {defaultValue: name}),
            date = (stamp)
                    ? new Date(stamp).toLocaleDateString(Lang, dateFormat)
                    : '-',
            active = (name === this.state.selectedPreset)? 'active': '';
      dropdownItems.push(
        <MenuItem key={name} eventKey={[name, label]} data-target={name} onSelect={this.onPresetItemClicked.bind(this)}>
          <div>{label}</div>
          <div>{date}</div>
        </MenuItem>
      );
      modalItems.push(
        <label key={name} className={'btn btn-default btn-radio form-group row ' + active}>
          <input type='radio' name='presetList' value={name} style={radioStyle} onClick={this.onRadioChanged.bind(this)}></input>
          <div className='col-xs-5 target'>{label}</div>
          <div className='col-xs-7 date'>{date}</div>
        </label>
      );
    }
    return (
      <FormGroup className='settings-top settings-append row'>
        <I18N.ColWithControlLabel sm={4} htmlFor='presetList' className='param-label' data-i18n='label.presetList'/>
        <Col sm={8}>
          <ButtonGroup id='presetList'>
            <ButtonGroup>
              <I18N.DropdownButton id='presetList-menu' bsStyle='default' data-i18n='label.presetList-load' onToggle={this.onToggleDropdown.bind(this)}>
                <MenuItem header>
                  <I18N.Div data-i18n='label.presetList-caption-target'/>
                  <I18N.Div data-i18n='label.presetList-caption-date'/>
                </MenuItem>
                {dropdownItems}
              </I18N.DropdownButton>
            </ButtonGroup>
            <I18N.Button bsStyle='default' className='btn-open-dialog' data-i18n='label.presetList-save' onClick={this.onPresetSaveClicked.bind(this)}/>
          </ButtonGroup>
        </Col>
        <Modal id='saveToPresetModal' bsSize='sm' show={this.state.showModal} onHide={this.onModalClose.bind(this)}>
          <Modal.Header>
            <I18N.ModalTitle data-i18n='label.presetList-save'/>
          </Modal.Header>
          <Modal.Body className='presetList'>
            <FormGroup className='presetList-header row'>
              <I18N.Div className='col-xs-5 target' data-i18n='label.presetList-caption-target'/>
              <I18N.Div className='col-xs-7 date' data-i18n='label.presetList-caption-date'/>
            </FormGroup>
            <FormGroup id='PresetList-placeholder' className='btn-group-vertical'>
              {modalItems}
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <I18N.Button bsStyle='default' data-i18n='label.cancel' onClick={this.onModalClose.bind(this)}/>
            <I18N.Button bsStyle='default' data-i18n='label.save' action='continue' disabled={!this.state.selectedPreset} onClick={this.onModalContinue.bind(this)}/>
          </Modal.Footer>
        </Modal>
      </FormGroup>
    );
  }
}
