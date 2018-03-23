//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import PropBase from './PropBase';
import * as I18N from './i18n';


export default class SleepModeStatus extends React.Component {
  value() {
    return undefined;
  }

  render() {
    if (!this.props.propDesc) {
      return (<div/>);
    }
    const current = this.props.propDesc.get('current');
    if (current === undefined) {
      return (<div/>);
    }
    return (
      <PropBase {...(this.props)} optLabel='label.SleepMode-title'>
        <I18N.Div className='col-sm-4' data-i18n={`SleepMode.${current}`}/>
        {this.props.children}
      </PropBase>
    );
  }
}
