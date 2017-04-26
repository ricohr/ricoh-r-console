//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import PropBase from './PropBase';


export default class RadioButtons extends React.Component {
  value() {
    return this._value;
  }

  onRadioChanged(e) {
    this._value = parseInt(e.target.value);
    if (this.props.onChange) {
      this.props.onChange(this._value, this.props.propName);
    }
  }

  render() {
    if (!this.props.propDesc) {
      this._value = undefined;
      return (<div/>);
    }
    const data = this.props.propDesc.toObject(),
          name = this.props.propName,
          radioButtons = data.values.map((value)=>{
            let checked, active;
            if (value === data.current) {
              checked = true;
              active  = '';
            } else {
              checked = false;
              active  = '';
            }
            const imgProp = this.props[`img_${value}`],
                  img = (imgProp)? (<img src={imgProp.src} alt={imgProp.alt}/>): '';
            return (
              <label key={value} className={'radio-inline ' + active}>
                <input type='radio' name={name} value={value} checked={checked} onChange={this.onRadioChanged.bind(this)}/>
                <span className='radio-icon'/>
                {i18next.t(name + '.' + value, {defaultValue: '' + value})}
                {img}
              </label>
            );
          });
    this._value = data.current;
    return (
      <PropBase {...(this.props)}>
        {radioButtons}
        {this.props.children}
      </PropBase>
    );
  }
}
