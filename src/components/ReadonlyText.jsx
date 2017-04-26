//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import PropBase from './PropBase';
import * as I18N from './i18n';


export default class ReadonlyText extends React.Component {
  value() {
    return undefined;
  }

  render() {
    if (!this.props.propDesc) {
      return (<div/>);
    }
    const current = this.props.propDesc.get('current');
    return (
      <PropBase {...(this.props)}>
        <I18N.Div className='col-sm-8' data-i18n={`StillCaptureMode.${current}`}/>
        {this.props.children}
      </PropBase>
    );
  }
}
