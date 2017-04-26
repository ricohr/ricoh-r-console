//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import {FormGroup} from 'react-bootstrap';
import ModalFrame from '../components/ModalFrame';
import * as I18N from '../components/i18n';


export default class DeviceInfo extends React.Component {
  show() {
    this.refs.modal.show();
  }

  render() {
    const currentId = this.props.appStore.get('current').deviceId,
          info = this.props.appStore.get('devices').get(currentId);
    if (!info) {
      return (<div/>);
    }
    const elements = ['Manufacturer', 'Model', 'SerialNumber', 'DeviceVersion'].map(name=>{
            if (info[name]) {
              return (
                <FormGroup className='row' key={name}>
                  <I18N.ColWithControlLabel sm={5} htmlFor={'DeviceInfo-'+name} className='param-label' data-i18n={'deviceInfo.'+name}/>
                  <div id={DeviceInfo-'+name'} className='col-xs-7'>{info[name]}</div>
                </FormGroup>
              )
            } else {
              return '';
            }
          });
    return (
      <ModalFrame ref='modal' modalId='deviceInfoModal' title='label.DeviceInfo' {...this.props}>
        {elements}
      </ModalFrame>
    );
  }
}
