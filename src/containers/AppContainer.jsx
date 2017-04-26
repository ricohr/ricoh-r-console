//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import {Container} from 'flux/utils';

import Navigation from '../views/Navigation';
import DeviceList from '../views/DeviceList';
import Preset from '../views/Preset';
import Properties from '../views/Properties';
import HowToUse from '../views/HowToUse';
import AppStore from '../data/AppStore';
import AppActions from '../data/AppActions';
import PresetActionCreator from '../data/PresetActionCreator';


function getStores() {
  return [
    AppStore,
  ];
}

function getState() {
  return {
    appStore: AppStore.getState(),
    appActions: AppActions,
  };
}


function AppView(props) {
  const deviceId = props.appStore.get('current').deviceId,
        data = (deviceId)? 'id:'+deviceId : '';
  return (
    <div id='application' data-deviceId={data}>
      <Navigation {...props} />
      <div className='container'>
        <DeviceList {...props} />
        <div id='settings' className='hide-when-nodevices'>
          <Preset {...props} />
          <Properties {...props} />
        </div>
      </div>
      <HowToUse/>
    </div>
  );
}


const AppContainerBase = Container.createFunctional(AppView, getStores, getState);

export default class AppContainer extends AppContainerBase {
  componentDidMount() {
    MTP.onDeviceAdded = (deviceId)=>{
      MTP.deviceList().then((devices)=>{
        AppActions.onDeviceAdded(deviceId, devices);
      });
    };
    MTP.onDeviceRemoved = (deviceId)=>{
      MTP.deviceList().then((devices)=>{
        AppActions.onDeviceRemoved(deviceId, devices);
      }).catch((e)=>{
        AppActions.onDeviceRemoved(deviceId, {});
      })
    };
    MTP.deviceList().then((devices)=>{
      AppActions.onDeviceAdded(null, devices);
    });
    PresetActionCreator.load();
  }
}
