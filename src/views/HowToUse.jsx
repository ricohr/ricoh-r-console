//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import FS from 'fs';
import React from 'react';
import ReactDOM from 'react-dom';


export default class HowToUse extends React.Component {
  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);
    $(element).selectpicker(this.props).selectpicker('refresh');
    FS.readFile(__dirname + '/../../assets/usage/' + Lang + '.html', (err, body)=>{
      element.innerHTML = body;
    });
  }

  render() {
    return (
      <div id='howToUse' className='settings-body hide-when-device-connected usage'/>
    );
  }
}
