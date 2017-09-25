//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import PropBase from './PropBase';
import BootstrapSlider from './bootstrap-slider';


export default class MinMaxSlider extends React.Component {
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
    const data = this.props.propDesc.toObject();
    if (!data.step) {
      return (<div/>);
    }
    const options = {
            step: data.step,
            min: data.min,
            max: data.max,
            ticks: [data.min, data.max, data.max, data.max, data.max, data.max],
            ticks_labels: [data.min, data.max, '', '', '', ''],
            ticks_positions: [0, 100, 100, 100, 100, 100],
            value: data.current,
            tooltip_position: 'bottom',
            mute: this.props.mute
          };
    return (
      <PropBase {...(this.props)}>
        <BootstrapSlider ref='slider' options={options} onChange={this.onChange.bind(this)}/>
      </PropBase>
    );
  }
}
