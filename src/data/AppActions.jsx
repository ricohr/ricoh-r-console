//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import AppDispatcher from './AppDispatcher'


export const AppActionTypes = {
  OnDeviceAdded: 'OnDeviceAdded',
  OnDeviceRemoved: 'OnDeviceRemoved',
  SelectDevice: 'SelectDevice',
  SetPropertyAll: 'SetPropertyAll',
  SetProperty: 'SetProperty',

  SetPresets: 'SetPresets',
  UpdatePreset: 'UpdatePreset',
  MuteSlider: 'MuteSlider',
}


export default class AppActions {
  static onDeviceAdded(deviceId, devices) {
    AppDispatcher.dispatch({type: AppActionTypes.OnDeviceAdded, deviceId, devices});
  }

  static onDeviceRemoved(deviceId, devices) {
    AppDispatcher.dispatch({type: AppActionTypes.OnDeviceRemoved, deviceId, devices});
  }

  static selectDevice(deviceId) {
    AppDispatcher.dispatch({type: AppActionTypes.SelectDevice, deviceId});
  }

  static setPropertyAll(deviceId, propValues) {
    AppDispatcher.dispatch({type: AppActionTypes.SetPropertyAll, deviceId, propValues});
  }

  static setProperty(deviceId, propName, propValue) {
    AppDispatcher.dispatch({type: AppActionTypes.SetProperty, deviceId, propName, propValue});
  }

  static setPresets(presets) {
    AppDispatcher.dispatch({type: AppActionTypes.SetPresets, presets});
  }

  static updatePreset(presetId, preset) {
    AppDispatcher.dispatch({type: AppActionTypes.UpdatePreset, presetId, preset});
  }

  static muteSlider(boolValue) {
    AppDispatcher.dispatch({type: AppActionTypes.MuteSlider, boolValue});
  }
}
