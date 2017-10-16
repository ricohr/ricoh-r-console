//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import {FormGroup} from 'react-bootstrap';
import PropBase from './PropBase';
import BootstrapSlider from './bootstrap-slider';
import * as I18N from './i18n';


export default class ColorTemperature extends React.Component {
  value() {
    if (this.refs.slider) {
      return this.refs.slider.value();
    }
    return undefined;
  }

  onChange(value) {
    if (this.props.onChange) {
      this.props.onChange(value, this.props.propName);
    }
  }

  render() {
    if (!this.props.propDesc) {
      return (<div/>);
    }
    if (this.props.hideItem) {
      return (<div/>);      
    }
    const data = this.props.propDesc.toObject();
    if (!data.step) {
      return (<div/>);
    }
    const options = {
            step: data.step,
            min: data.min,
            max: data.max,
            ticks: [data.min, 5000, 7500, data.max],
            ticks_labels: [data.min, 5000, '', data.max + ' K'],
            value: data.current,
            tooltip_position: 'bottom',
            mute: this.props.mute
          };
    const imgStyle = {
            'margin-left': '14px'
          };
    return (
      <PropBase {...(this.props)}>
          <img src='./assets/images/color-temp-bar.png' style={imgStyle} /><br/>
          <BootstrapSlider ref='slider' options={options} onChange={this.onChange.bind(this)}/>
      </PropBase>
    );
  }
}
