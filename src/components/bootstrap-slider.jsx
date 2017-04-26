//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import ReactDOM from 'react-dom';


export default class BootstrapSlider extends React.Component {
  constructor(props) {
    super(props);
    this._value = this.props.options.value;
  }

  value() {
    return this._value;
  }

  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);
    this.slider = $(element)
      .slider(this.props.options)
      .slider((this.props.options.mute)? 'disable': 'enable')
      .on('slideStop', (e)=>{
        this._value = this.slider.slider('getValue');
        if (this.props.onChange) {
          this.props.onChange(this._value);
        }
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.options.value !== this.props.options.value) {
      this.slider.slider('setValue', this.props.options.value);
      this._value = this.props.options.value;
    }
    if (prevProps.options.mute !== this.props.options.mute) {
      this.slider.slider((this.props.options.mute)? 'disable': 'enable');
    }
  }

  render() {
    return (<div/>);
  }
}
