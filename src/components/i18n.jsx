//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactBootstrap from 'react-bootstrap';


function TextComponentBase(RenderComponent, ext) {
  return (props)=>{
    const label = i18next.t(props['data-i18n']);
    return (<RenderComponent {...props} {...ext}>{label}</RenderComponent>);
  };
}

function TitleHasChildrenComponentBase(RenderComponent, ext) {
  return (props)=>{
    const label = i18next.t(props['data-i18n']);
    return (<RenderComponent {...props} title={label} {...ext}>{props.children}</RenderComponent>);
  };
}

export const MenuItem   = TextComponentBase(ReactBootstrap.MenuItem);
export const NavItem    = TextComponentBase(ReactBootstrap.NavItem);
export const Button     = TextComponentBase(ReactBootstrap.Button);
export const ModalTitle = TextComponentBase(ReactBootstrap.Modal.Title);
export const ColWithControlLabel = TextComponentBase(ReactBootstrap.Col, {componentClass: ReactBootstrap.ControlLabel});
export const NavDropdown    = TitleHasChildrenComponentBase(ReactBootstrap.NavDropdown);
export const DropdownButton = TitleHasChildrenComponentBase(ReactBootstrap.DropdownButton);
export const Div    = TextComponentBase('div');
export const Label  = TextComponentBase('label');
export const Option = TextComponentBase('option');

export class DivHTML extends React.Component {
  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);
    element.innerHTML = i18next.t(this.props['data-i18n']);
  }
  render() {
    return (<div {...this.props}/>)
  }
}
