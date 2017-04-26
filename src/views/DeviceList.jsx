//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import {FormGroup, Col, Button} from 'react-bootstrap';
import BootstrapSelect from '../components/bootstrap-select';
import * as I18N from '../components/i18n';
import DeviceInfo from './DeviceInfo';


export default class DeviceList extends React.Component {
  onDeviceInfoClicked() {
    this.refs.deviceInfo.show();
  }

  onDeviceChanged(e) {
    this.props.appActions.selectDevice(e.target.value);
  }

  render() {
    var value = false;
    const devices = this.props.appStore.get('devices').toObject(),
          deviceIds = Object.keys(devices),
          currentId = this.props.appStore.get('current').deviceId,
          options = deviceIds.map(deviceId=>{
            const device = devices[deviceId],
                  model = device.Model,
                  sn = device.SerialNumber;
            if (deviceId === currentId) {
              value = deviceId;
            }
            return (<option key={deviceId} value={deviceId}>{model} - {sn}</option>);
          }),
          noneSelectedText = (deviceIds.length === 0)? 'DeviceList.No Devices': 'DeviceList.selectDevice';
    return (
      <FormGroup className='settings-top row'>
        <I18N.ColWithControlLabel sm={4} className='param-label' data-i18n='label.DeviceList'/>
        <Col sm={8}>
          <BootstrapSelect id='deviceList' width='auto' value={value} onChange={this.onDeviceChanged.bind(this)}>
            <I18N.Option disabled value={false} data-i18n={noneSelectedText}/>
            {options}
          </BootstrapSelect>
          <Button id='deviceInfo' className='btn-open-dialog hide-when-nodevices' onClick={this.onDeviceInfoClicked.bind(this)}>
            {i18next.t('label.DeviceInfo')}
          </Button>
        </Col>
        <DeviceInfo ref='deviceInfo' {...this.props}/>
      </FormGroup>
    );
  }
}
