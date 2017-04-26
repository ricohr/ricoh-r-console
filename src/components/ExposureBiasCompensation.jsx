//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import PropBase from './PropBase';
import BootstrapSlider from './bootstrap-slider';


export default class ExposureBiasCompensation extends React.Component {
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
    const data = this.props.propDesc.toObject(),
          data_values = data.values.toArray();
    function reverseIndex(index) {
      return data_values.length - 1 - index;
    }
    function index2value(index) {
      const i = Math.min(Math.max(parseInt(index), 0), data_values.length - 1);
      return data_values[reverseIndex(i)];
    }
    function value2index(value) {
      const index = data_values.findIndex((v)=>(v === value));
      if (index < 0) {
        return index;
      }
      return reverseIndex(index);
    }
    function value2label(v, i) {
      const l = (v/1000.0).toFixed(2);
      if (i && i === 4) {
        return l + ' EV';
      }
      return l;
    }
    const ticks = [100, 75, 50, 25, 0].map((k)=>parseInt((data_values.length-1)*k/100.0)),
          labels = ticks.map((i)=>data_values[i]).map(value2label),
          options = {
            min:  0,
            max:  ticks[ticks.length-1],
            step: 1,
            ticks: ticks,
            ticks_labels: labels,
            value: value2index(data.current),
            formatter: (v)=>value2label(index2value(v)),
            tooltip_position: 'bottom',
            mute: this.props.mute
          };
    return (
      <PropBase {...(this.props)}>
        <BootstrapSlider ref='slider' options={options} onChange={value=>this.onChange(index2value(value))}/>
      </PropBase>
    );
  }
}
