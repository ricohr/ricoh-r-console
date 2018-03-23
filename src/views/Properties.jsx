//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import {FormGroup, Col, Button} from 'react-bootstrap';
import * as I18N from '../components/i18n';

import RadioButtons from '../components/RadioButtons';
import MinMaxSlider from '../components/MinMaxSlider';
import ReadonlyText from '../components/ReadonlyText';
import SleepModeStatus from '../components/SleepModeStatus';
import RGBGain from '../components/RGBGain';
import ColorTemperature from '../components/ColorTemperature';
import ExposureBiasCompensation from '../components/ExposureBiasCompensation';
import ResetToDefault from './ResetToDefault';
import MtpActionCreator from '../data/MtpActionCreator';
import Notify from '../components/Notify';


const _VideoOutputImages = {
        img_0: { src: './assets/images/icon_FullHD.png',   alt: 'full' },
        img_1: { src: './assets/images/icon_actualsize.png', alt: 'actual' }
      };


function HR(props) {
  const d = (props.show)? {}: {display: 'none'};
  return (<hr style={d}/>);
}

function Icon(props) {
  const d = (props.show)? {}: {display: 'none'};
  return (<div className={'group-icon ' + props.icon} style={d}/>);
}


function getDesc(immMap, propName) {
  if (!immMap[propName]) {
    return {};
  }
  return immMap[propName].toObject();
}

export default class Properties extends React.Component {
  onResetToDefault() {
    this.refs.resetToDefaultModal.show();
  }

  onPropChanged(value, propName) {
    (new MtpActionCreator()).setPropValue(propName, value).then(result=>{
      switch (result.status) {
      case 'OK':
        Notify.showSuccess('propertyUpdated', propName);
        break;
      case 'FAILED(2019)':
        Notify.show(result.status, 'failedWhileRecording', {i18n_prefix:'notify'});
        reloadValue();
        break;
      default:
        Notify.showDanger('propertyUpdateFailed', propName);
      }
    });
  }

  render() {
    const current = this.props.appStore.get('current');
    var propValues = {},
        showItems = false;
    if (current.deviceId) {
      if (current.propValues) {
        propValues = current.propValues.toObject();
        showItems = true;
      } else {
        (new MtpActionCreator()).loadProperties();
      }
    }
    const WhiteBalance_Manual = 1,
          WhiteBalance_ColorTemperature = 32775,
          StitchMode_Auto = 1,
          SleepMode_awake = 0,
          SleepMode_sleep = 1,
          SleepMode_current = getDesc(propValues, 'SleepMode').current,
          SleepModeButtonMode = (SleepMode_current === SleepMode_awake) ? SleepMode_sleep  : SleepMode_awake,
          SleepModeButtonLabel = (SleepMode_current === SleepMode_awake) ? 'label.SleepMode-shift-sleep' : 'label.SleepMode-shift-awake',
          ZenithMode_Lock = 4,
          select_WhiteBalance = getDesc(propValues, 'WhiteBalance').current,
          hideRGBGain = !(select_WhiteBalance === WhiteBalance_Manual),
          hideColorTemperature = !(select_WhiteBalance === WhiteBalance_ColorTemperature),
          enableStitchModeButton = (getDesc(propValues, 'StitchMode').current === StitchMode_Auto),
          enableZenithModeButton = (getDesc(propValues, 'ZenithMode').current === ZenithMode_Lock),
          backdrop = this.props.appStore.get('mute')? (<div className='settings-backdrop'/>): ''
    return (
      <div id='settingItems' className='settings-body'>
        {backdrop}
        <Icon show={showItems} icon='icon-image'/>
        <ReadonlyText propName='StillCaptureMode' propDesc={propValues.StillCaptureMode}>
          <I18N.Button bsStyle='primary' className='btn-right-alignment' data-i18n='label.initializeProps' onClick={this.onResetToDefault.bind(this)}/>
        </ReadonlyText>
        <SleepModeStatus propName='SleepMode' propDesc={propValues.SleepMode}>
          <I18N.Button bsStyle='default' data-i18n={SleepModeButtonLabel} onClick={()=>this.onPropChanged(SleepModeButtonMode, 'SleepMode')}/>
        </SleepModeStatus>
        <RadioButtons propName='WhiteBalance' propDesc={propValues.WhiteBalance} onChange={this.onPropChanged.bind(this)}/>
        <RGBGain propName='RGBGain' propDesc={propValues.RGBGain} hideItem={hideRGBGain} onChange={this.onPropChanged.bind(this)}/>
        <ColorTemperature propName='ColorTemperature' propDesc={propValues.ColorTemperature} hideItem={hideColorTemperature} subItem={true} onChange={this.onPropChanged.bind(this)}/>
        <ExposureBiasCompensation propName='ExposureBiasCompensation' propDesc={propValues.ExposureBiasCompensation} onChange={this.onPropChanged.bind(this)}/>
        <RadioButtons propName='FlickerReductionMode' propDesc={propValues.FlickerReductionMode} onChange={this.onPropChanged.bind(this)}/>
        <RadioButtons propName='ZenithMode' propDesc={propValues.ZenithMode} onChange={this.onPropChanged.bind(this)}>
          <I18N.Button bsStyle='default' data-i18n='label.retryZenithLock' disabled={!enableZenithModeButton} onClick={()=>this.onPropChanged(ZenithMode_Lock, 'ZenithMode')}/>
        </RadioButtons>
        <RadioButtons propName='VideoOutput' propDesc={propValues.VideoOutput} {..._VideoOutputImages} onChange={this.onPropChanged.bind(this)}/>
        <RadioButtons propName='WDR' propDesc={propValues.WDR} onChange={this.onPropChanged.bind(this)}/>
        <RadioButtons propName='StitchMode' propDesc={propValues.StitchMode} onChange={this.onPropChanged.bind(this)}>
          <I18N.Button bsStyle='default' data-i18n='label.retryDetect' disabled={!enableStitchModeButton} onClick={()=>this.onPropChanged(StitchMode_Auto, 'StitchMode')}/>
        </RadioButtons>
        <RadioButtons propName='VideoBitrate' propDesc={propValues.VideoBitrate} onChange={this.onPropChanged.bind(this)}/>
        <HR show={showItems}/>
        <Icon show={showItems} icon='icon-volume'/>
        <RadioButtons propName='AudioOutput' propDesc={propValues.AudioOutput} onChange={this.onPropChanged.bind(this)}/>
        <MinMaxSlider propName='AudioInputGain' propDesc={propValues.AudioInputGain} onChange={this.onPropChanged.bind(this)}/>
        <HR show={showItems}/>
        <Icon show={showItems} icon='icon-led'/>
        <MinMaxSlider propName='StandbyLedBrightness' propDesc={propValues.StandbyLedBrightness} onChange={this.onPropChanged.bind(this)}/>
        <MinMaxSlider propName='TransmittingLedBrightness' propDesc={propValues.TransmittingLedBrightness} onChange={this.onPropChanged.bind(this)}/>
        <ResetToDefault ref='resetToDefaultModal' {...this.props}/>
      </div>
    );
  }
}
