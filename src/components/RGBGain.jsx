//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import {FormGroup} from 'react-bootstrap';
import PropBase from './PropBase';
import BootstrapSlider from './bootstrap-slider';
import * as I18N from './i18n';


export default class RGBGain extends React.Component {
  value() {
    return this._value;
  }

  onChange() {
    const r = this.refs.slider_red.value(),
          b = this.refs.slider_blue.value();
    this._value = [r, this.green_value, b].join(':');
    if (this.props.onChange) {
      this.props.onChange(this._value, this.props.propName);
    }
  }

  render() {
    if (!this.props.propDesc) {
      this._value = undefined;
      return (<div/>);
    }
    const data = this.props.propDesc.toObject();
    if (!data.max) {
      return (<div/>);
    }
    const vars = ['current', 'step', 'min', 'max'].reduce((hash,key)=>{
            hash[key] = data[key].split(':').map((v)=>parseInt(v));
            return hash;
          }, {}),
          options = [0,2].map(index=>{
            return {
              step: vars.step[index],
              min:  vars.min[index],
              max:  vars.max[index],
              ticks: [0, 100, 200, 300, 400, 500],
              ticks_labels: [0, 100, '', '', '', '500 %'],
              ticks_positions: [0, 20, 40, 60, 80, 100],
              value: vars.current[index],
              tooltip_position: 'bottom',
              mute: this.props.mute
            };
          });
    this.green_value = data.current.split(':')[1];
    this._value = data.current;
    return (
      <PropBase {...(this.props)} hideLabel={true}>
        <FormGroup className='row'>
          <I18N.Label htmlFor='RGBGain-red-group' className='col-form-label' data-i18n='label.RGBGain-red'/>
          <BootstrapSlider ref='slider_red' options={options[0]} onChange={this.onChange.bind(this)}/>
        </FormGroup>
        <FormGroup className='row'>
          <I18N.Label htmlFor='RGBGain-green-group' className='col-form-label' data-i18n='label.RGBGain-green'/>
          <div className='fixed-slider-value'>{this.green_value} %</div>
        </FormGroup>
        <FormGroup className='row'>
          <I18N.Label htmlFor='RGBGain-blue-group' className='col-form-label' data-i18n='label.RGBGain-blue'/>
          <BootstrapSlider ref='slider_blue' options={options[1]} onChange={this.onChange.bind(this)}/>
        </FormGroup>
      </PropBase>
    );
  }
}
