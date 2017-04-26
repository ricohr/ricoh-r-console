//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import ReactDOM from 'react-dom';


export default class BootstrapSelect extends React.Component {
  refresh() {
    const element = ReactDOM.findDOMNode(this);
    $(element).selectpicker(this.props).selectpicker('refresh');
  }

  componentDidMount() {
    this.refresh();
    const element = ReactDOM.findDOMNode(this);
    $(element).on('changed.bs.select', (e)=>{
      if (this.props.onChange) {
        return this.props.onChange(e);
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    this.refresh();
  }

  render() {
    const attr = ['id', 'value'].reduce((hash, key)=>{
            if (this.props.hasOwnProperty(key)) {
              hash[key] = this.props[key];
            }
            return hash;
          }, {});
    return (
      <select {...attr}>
        {this.props.children}
      </select>
    );
  }
}
