//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import FS from 'fs';
import AppStore from '../data/AppStore';
import AppActions from '../data/AppActions';
import Sleep from 'sleep-promise';

const _tmpdir = require('electron').remote.getCurrentWindow().tmpdir;
const _PropNames = [
  'StillCaptureMode',
  'WhiteBalance',
  'RGBGain',
  'ColorTemperature',
  'ExposureBiasCompensation',
  'FlickerReductionMode',
  'ZenithMode',
  'VideoOutput',
  'WDR',
  'StitchMode',
  'VideoBitrate',
  'AudioOutput',
  'AudioInputGain',
  'StandbyLedBrightness',
  'TransmittingLedBrightness'
]


export default class MtpActionCreator {
  constructor() {
    const current = AppStore.getState().get('current');
    this.deviceId = current.deviceId;
    this.propValues = current.propValues;
    this.mtpDevice = new MTP.Device(this.deviceId);
  }

  /* load deviceProps from device
    @return Promise of deviceProps
   */
  loadProperties() {
    const result = {};
    return Promise.all(_PropNames.map(name=>{
            return new Promise((resolve, reject)=>{
              this.mtpDevice.getPropDesc(name).then(desc=>{
                result[name] = desc;
                resolve();
              }).catch(e=>{
                reject(e);
              });
            });
          })).then(_=>{
            AppActions.setPropertyAll(this.deviceId, result);
            return result;
          })
  }

  /* set propValue
    @IN propName
    @IN propValues
    @return Promise of result
   */
  setPropValue(propName, propValue) {
    return this.mtpDevice.setPropValue(propName, propValue).then(result=>{
      if (result.status==='OK') {
        AppActions.setProperty(this.deviceId, propName, propValue);
      }
      return result;
    });
  }

  /* apply propValues
    @IN hash of propValues
    @return Promise of deviceProps
   */
  applyPropValues(propValues) {
    const ps = Object.keys(propValues).map(name=>{
            return this.mtpDevice.setPropValue(name, propValues[name])
          });
    return Promise.all(ps).then(Sleep(1000)).then(()=>{
      return this.loadProperties();
    });
  }

  /* write configObjectFile to device
      @IN hash
      @return    Promise-object
      @Promise-resolve (empty)
      @Promise-reject  (status)
   */
  writeConfigObject(hash) {
    const data = JSON.stringify(hash, null, '  ');
    const filename = _tmpdir + '/settings.txt';
    return new Promise((resolve, reject)=>{
      FS.writeFile(filename, data, (err)=>{
        if (!err) {
          this.mtpDevice.sendConfigObject(filename).then((data)=>{
            switch (data.status) {
            case 'OK':
              resolve();
              break;
            default:
              reject(data.status);
            }
          });
        } else {
          reject(err);
        }
      });
    });
  }

  /* remove configObjectFile from device
      @IN hash
      @return    Promise-object
      @Promise-resolve (empty)
      @Promise-reject  (status)
   */
  removeConfigObject() {
    return this.writeConfigObject({});
  }
};
