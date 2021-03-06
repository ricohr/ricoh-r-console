//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import {FormGroup, Col} from 'react-bootstrap';
import * as I18N from './i18n';


export default class PropBase extends React.Component {
  constructor(props) {
    super(props);
    this.label = (this.props.hideLabel) ? '': 'label.'+this.props.propName;
    this.label = (this.props.optLabel === undefined) ? this.label: this.props.optLabel;
  }

  render() {
    const name = this.props.propName,
          className = (this.props.hideLabel) ? '': 'param-label',
          subItemClass = (this.props.subItem) ? 'sub-': '',
          labelClassName = subItemClass + className;
    return (
      <FormGroup className='row'>
        <I18N.ColWithControlLabel sm={4} htmlFor={name+'-group'} className={labelClassName} data-i18n={this.label}/>
        <Col id={name+'-group'} sm={8}>
          <span data-deviceProperty={name}>
            {this.props.children}
          </span>
        </Col>
      </FormGroup>
    );
  }
}
