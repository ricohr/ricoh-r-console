//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import {AppActions, AppActionTypes} from './AppActions';
import AppDispatcher from './AppDispatcher'


const Device = Immutable.Record({
  deviceId: null,
  propValues: null,
});


class AppStoreBase extends ReduceStore {
  constructor() {
    super(AppDispatcher);
  }

  getInitialState() {
    return Immutable.Map({
      devices: Immutable.Map(),
      current: new Device(),
      presets: Immutable.Map(),
      mute: false,
    });
  }

  OnDeviceAdded(state, action) {
    return state.set('devices', Immutable.Map(action.devices));
  }

  OnDeviceRemoved(state, action) {
    const result = state.set('devices', Immutable.Map(action.devices));
    if (result.get('current').deviceId !== action.deviceId) {
      return result;
    }
    return result.set('current', new Device());
  }

  SelectDevice(state, action) {
    if (!state.get('devices').get(action.deviceId)) {
      return state;
    }
    return state.set('current', new Device({deviceId: action.deviceId}));
  }

  SetPropertyAll(state, action) {
    if (state.get('current').deviceId !== action.deviceId) {
      return state;
    }
    return state.update('current',
            _=>_.set('propValues', Immutable.fromJS(action.propValues)));
  }

  SetProperty(state, action) {
    if (state.get('current').deviceId !== action.deviceId) {
      return state;
    }
    return state.update('current',
            _=>_.update('propValues',
            _=>_.update(action.propName,
            _=>_.set('current', action.propValue))));
  }

  SetPresets(state, action) {
    return state.set('presets', Immutable.fromJS(action.presets));
  }

  UpdatePreset(state, action) {
    return state.update('presets',
            _=>_.set(action.presetId, Immutable.fromJS(action.preset)));
  }

  MuteSlider(state, action) {
    return state.set('mute', action.boolValue);
  }

  reduce(state, action) {
    console.debug('DeviceStoreBase', action);
    if (this[action.type]) {
      return this[action.type](state, action);
    }
    return state;
  }
}

export default new AppStoreBase();
