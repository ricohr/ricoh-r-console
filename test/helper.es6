//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import FS from 'fs';
import path from 'path';
import {expect, app, dialogFixtureName, Sleep} from './common';
import * as Actions from './steps/actions';


function SetDialogFilename(value) {
  if (value) {
    value = path.join(__dirname, value);
    FS.writeFileSync(dialogFixtureName, value, 'utf-8');
  } else {
    try {
      FS.unlinkSync(dialogFixtureName);
    } catch (e) {
    }
  }
  return value;
}


function MTPMock_PropValue(target, property) {
  return Sleep(100).then(()=>{
    return app.client.execute(()=>MTP.MTPMock);
  }).then(_=>{
    const id = Object.keys(_.value.Props)[0];
    if (property) {
      return _.value.Props[id].deviceProps[target][property];
    } else if (target) {
      return _.value.Props[id].deviceProps[target];
    } else {
      return _.value.Props[id].deviceProps;
    }
  });
}


function MTPMock_SavedConfigObject() {
  return Sleep(100).then(()=>{
    return app.client.execute(()=>MTP.MTPMock);
  }).then(_=>{
    return _.value.SavedConfigObject;
  });
}


function MTPMock_SetRecordingState(value) {
  return app.client.execute(_=>{ MTP.MTPMock.DeviceIsRecording = _; }, value).then(Sleep(500));
}


function MTPMock_AddDevice(value) {
  return app.client.execute(_=>MTP.addDevice(_), value).then(Sleep(500));
}


function MTPMock_RemoveDevice(value) {
  return app.client.execute(_=>MTP.removeDevice(_), value).then(Sleep(500));
}


function i18next_t(key) {
  return app.client.execute(_=>i18next.t(_), key).then(_=>_.value);
}


function notify_selector(title_i18n) {
  return '#notify-container div:nth-child(1) [data-notify="title"] [data-i18n="' + title_i18n + '"]';
}


function wait_dialog_to_close(timeout, timeoutMsg, interval) {
  return app.client.waitUntil(()=>{
    return app.client.elements(".modal").then(_=>_.value.length===0);
  }, timeout, timeoutMsg, interval).then(Sleep(200));
}


function wait_notify_to_close(timeout, timeoutMsg, interval) {
  return app.client.waitUntil(()=>{
    return app.client.getText('#notify-container').then((v)=>{
      return v === '';
    });
  }, timeout, timeoutMsg, interval).then(Sleep(200));
}


function wait_close_all(timeout, timeoutMsg, interval) {
  return Promise.all([
    wait_dialog_to_close(timeout, timeoutMsg, interval),
    wait_notify_to_close(timeout, timeoutMsg, interval)
  ]);
}


function wait_for_unvisible(selector, timeout) {
  return app.client.waitUntil(()=>{
    return app.client.isVisible(selector).then((v)=>{
      if (typeof(v) === 'boolean') {
        return !v;
      }
      return !v.find(_=>_===true);
    });
  }, timeout);
}


function expect_current_value_when_button_is_clicked(target, nth_button/* 1~ */, expect_value) {
  return Actions.Props.Items.click(target, nth_button).then(()=>{
    return expect(MTPMock_PropValue(target, 'current')).eventually.to.equal(expect_value);
  });
}


function expect_current_value_when_slider_is_clicked(target, position, expect_value) {
  return Actions.Props.Items.click_slider(target, position).then(()=>{
    return expect(MTPMock_PropValue(target, 'current')).eventually.to.equal(expect_value);
  });
}


function expect_current_value_when_RGBGain_slider_is_clicked(target, position, expect_value) {
  return Actions.Props.RGBGain.click_slider(target, position).then(()=>{
    return MTPMock_PropValue('RGBGain', 'current');
  }).then((value)=>{
    return expect(value).to.match(expect_value);
  });
}


function expect_mtpprop_value(props, target, value) {
  expect(props[target].current).to.equal(value);
}


function expect_mtpprop_value_is_default(props, target) {
  expect(props[target].current).to.equal(props[target].factory_default_value);
}


function expect_radio_states(target, pattern) {
  pattern = pattern.map(_=>(_)? _.toString(): null);
  return app.client.getAttribute(`[data-deviceProperty="${target}"] input`, 'checked').then(elms=>{
    return expect(elms).to.eql(pattern);
  });
}


function expect_button_states(target, pattern) {
  return Promise.all([
    expect_radio_states(target, pattern)
  ]);
}


function expect_slider_state(props, target, expect_value) {
  if (expect_value === undefined) {
    expect_value = props[target].factory_default_value;
  }
  return app.client.getHTML('[data-deviceProperty="' + target + '"] .tooltip-main .tooltip-inner').then(_=>{
    const re = new RegExp('<div .+>(.+)</div>');
    const t = _.match(/<div .+>(.+)<\/div>/);
    return Promise.all([
      expect(_.match(re)),
      expect(parseFloat(t[1])).to.equal(expect_value)
    ]);
  });
}


function expect_RGBGain_slider_state(props, target, expect_value) {
  const index = (target==='red')? 0: 2;
  if (expect_value === undefined) {
    expect_value = props.RGBGain.factory_default_value;
  }
  const ev = expect_value.split(':')[index];
  return app.client.getHTML('label[for=RGBGain-' + target + '-group]+div .tooltip-main .tooltip-inner').then(_=>{
    const re = new RegExp('<div .+>(.+)</div>');
    const t = _.match(/<div .+>(.+)<\/div>/);
    return Promise.all([
      expect(_.match(re)),
      expect(t[1]).to.equal(ev)
    ]);
  });
}


function expect_ui_state(target, expect_value, props) {
  if (!props) {
    return MTPMock_PropValue().then(props=>{
      return expect_ui_state(target, expect_value, props);
    });
  }
  const prop = props[target];
  if(typeof(expect_value)==='object') {
    expect_value = expect_value[target];
  } else if (expect_value === null) {
    expect_value = prop.factory_default_value;
  }

  switch (target) {
  case 'RGBGain':
    return app.client.getAttribute('[data-deviceProperty="RGBGain"] .slider', 'class').then(elms=>{
      const expect_enable = (parseInt(props.WhiteBalance.current)===1);
      return Promise.all([
        expect_mtpprop_value(props, target, expect_value),
        expect_RGBGain_slider_state(props, 'red',  expect_value),
        expect_RGBGain_slider_state(props, 'blue', expect_value),
        Promise.all(elms.map(elm=>
          expect_enable?
            expect(elm).not.to.string('slider-disabled'):
            expect(elm).to.string('slider-disabled')
        ))
      ]);
    });
  case 'ExposureBiasCompensation':
    return Promise.all([
      expect_mtpprop_value(props, target, expect_value),
      expect_slider_state(props, target, expect_value/1000.0)
    ]);
  case 'StitchMode':
    const order = prop.values.map(_=>_===prop.current);
    const expect_enable = (parseInt(expect_value)>0);
    return app.client.getAttribute('[data-deviceProperty="StitchMode"] button', 'class').then(elm=>{
      return Promise.all([
        expect_mtpprop_value(props, target, expect_value),
        expect_button_states(target, order),
        expect_enable?
          expect(elm).not.to.string('disabled'):
          expect(elm).to.string('disabled')
      ]);
    });
  default:
    if (prop.values) {
      // buttons.
      const order = prop.values.map(_=>_===prop.current);
      return Promise.all([
        expect_mtpprop_value(props, target, expect_value),
        expect_button_states(target, order)
      ]);
    } else {
      // slider.
      return Promise.all([
        expect_mtpprop_value(props, target, expect_value),
        expect_slider_state(props, target, expect_value)
      ]);
    }
  }
}


const PropNames = [
  "WhiteBalance",
  "RGBGain",
  "ExposureBiasCompensation",
  "ZenithMode",
  "VideoOutput",
  "WDR",
  "StitchMode",
  "VideoBitrate",
  "AudioOutput",
  "AudioInputGain",
  "StandbyLedBrightness",
  "TransmittingLedBrightness"
];


function CollectCurrentsFromProps(props) {
  return PropNames.reduce((hash, key)=>{
    hash[key] = props[key].current;
    return hash;
  }, {});
}


module.exports = {
  SetDialogFilename,
  MTPMock_PropValue,
  MTPMock_SavedConfigObject,
  MTPMock_SetRecordingState,
  MTPMock_AddDevice,
  MTPMock_RemoveDevice,
  i18next_t,

  notify_selector,
  wait_dialog_to_close,
  wait_notify_to_close,
  wait_close_all,
  wait_for_unvisible,

  expect_current_value_when_button_is_clicked,
  expect_current_value_when_slider_is_clicked,
  expect_current_value_when_RGBGain_slider_is_clicked,

  expect_mtpprop_value,
  expect_mtpprop_value_is_default,
  expect_radio_states,
  expect_button_states,
  expect_slider_state,
  expect_RGBGain_slider_state,

  expect_ui_state,

  CollectCurrentsFromProps,
};
