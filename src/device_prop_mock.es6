//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import FS from 'fs';


function getPropDesc(deviceId, name) {
  MTP.MTPMock.Props[deviceId].deviceProps[name].readCount += 1;
  return MTP.MTPMock.Props[deviceId].deviceProps[name];
}

function setProp(deviceId, name, value) {
  if (/^[-\d]+$/.test(value.toString())) {
    value = parseInt(value);
  }
  MTP.MTPMock.Props[deviceId].deviceProps[name].current = value;
  MTP.MTPMock.Props[deviceId].deviceProps[name].writeCount += 1;
}

function loadConfig(filename) {
  const data = MTP.MTPMock.SavedConfigObject;
  FS.writeFileSync(filename, data, 'utf-8');
}

function saveConfig(filename) {
  const data = FS.readFileSync(filename, 'utf-8');
  MTP.MTPMock.SavedConfigObject = data;
}


function isRecording()
{
  return MTP.MTPMock.DeviceIsRecording;
}


export default function(MTP, fixture) {
  const Super = MTP.Device;
  MTP.deviceIds = [];
  Object.keys(fixture).forEach((deviceId)=>{
    const dev = fixture[deviceId];
    if (dev.initial) {
      MTP.deviceIds.push(deviceId);
    }
    Object.keys(dev.deviceProps).forEach((key)=>{
      if (/^[A-Z]/.test(key)) {
        if (dev.deviceProps[key].current === undefined) {
          dev.deviceProps[key].current = dev.deviceProps[key].factory_default_value;
        }
        if (dev.deviceProps[key].get_set === undefined) {
          dev.deviceProps[key].get_set = 1;
        }
        dev.deviceProps[key].readCount  = 0;
        dev.deviceProps[key].writeCount = 0;
      }
    });
  });
  MTP.MTPMock = {Props: fixture, SavedConfigObject: {}, DeviceIsRecording: false};
  const Self = function(deviceId) {
    Super.call(this, deviceId);
  }
  Self.prototype = Object.create(Super.prototype);
  MTP.Device = Self;
  MTP.addDevice = function(deviceId) {
    MTP.deviceIds.push(deviceId);
    if (MTP.onDeviceAdded) MTP.onDeviceAdded(deviceId);
  }
  MTP.removeDevice = function(deviceId) {
    MTP.deviceIds = MTP.deviceIds.filter(_=>_!==deviceId);
    if (MTP.onDeviceRemoved) MTP.onDeviceRemoved(deviceId);
  }

  const originalDeviceList = MTP.deviceList;
  MTP.deviceList = function() {
    if (MTP.deviceIds.length > 0) {
      const infos = MTP.deviceIds.reduce((hash, id)=>{
        hash[id] = fixture[id].deviceInfo;
        return hash;
      }, {});
      return Promise.resolve(infos);
    }
    return originalDeviceList();
  }

  Self.prototype.deviceInfo = function() {
    if (fixture[this.deviceId] && fixture[this.deviceId].deviceInfo) {
      const data = fixture[this.deviceId].deviceInfo;
      data.status = "OK";
      return Promise.resolve(data);
    }
    return Super.prototype.deviceInfo.call(this);
  }

  Self.prototype.getPropDesc = function(propName) {
    if (fixture[this.deviceId] && fixture[this.deviceId].deviceProps[propName]) {
      const data = getPropDesc(this.deviceId, propName);
      data.status = "OK";
      return Promise.resolve(data);
    }
    return Super.prototype.getPropDesc.call(this, propName);
  }

  Self.prototype.setPropValue = function(propName, propValue) {
    if (fixture[this.deviceId] && fixture[this.deviceId].deviceProps[propName]) {
      setProp(this.deviceId, propName, propValue);
      return Promise.resolve({status: "OK"});
    }
    return Super.prototype.setPropValue.call(this, propName, propValue);
  }

  Self.prototype.sendConfigObject = function(filename) {
    if (fixture[this.deviceId] && fixture[this.deviceId].sendConfigObject) {
      if (isRecording()) {
        return Promise.resolve({status: "FAILED(2019)"});
      }
      saveConfig(filename);
      return Promise.resolve({status: "OK"});
    }
    return Super.prototype.sendConfigObject.call(this, filename);
  }

  Self.prototype.getConfigObject = function(filename) {
    if (fixture[this.deviceId] && fixture[this.deviceId].getConfigObject) {
      if (isRecording()) {
        return Promise.resolve({status: "FAILED(2019)"});
      }
      loadConfig(filename);
      return Promise.resolve({status: "OK"});
    }
    return Super.prototype.getConfigObject.call(this, filename);
  }

  Self.prototype.firmwareUpdate = function(filename) {
    if (fixture[this.deviceId] && fixture[this.deviceId].firmwareUpdate) {
      if (isRecording()) {
        return Promise.resolve({status: "FAILED(2019)"});
      }
      if (filename.endsWith("invalid.frm")) {
        return Promise.resolve({status: "Invalid file name"});
      }
      if (filename.endsWith("empty.frm")) {
        return Promise.resolve({status: "Invalid file content"});
      }
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve({status: "OK"});
        }, 1000);
      });
    }
    return Super.prototype.firmwareUpdate.call(this, filename);
  }
};
