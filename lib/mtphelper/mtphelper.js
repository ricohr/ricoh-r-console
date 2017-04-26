"use strict";
//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

//console.log(exports, require, module, __filename, __dirname, process, global);
const MTPDevice = function(deviceId) {
  this.deviceId = deviceId;
}

const MTPHelper = {
  version: "1.0.0",
  helper_version: "unknown",
  child: null,
  queue: null,
  onDeviceRemoved: null,  // (deviceId) => { ... }
  onDeviceAdded: null,    // (deviceId) => { ... }

  stderr_proc: function(data0) {
    for (var data of data0.split(/[\r\n]/)) {
      console.log("mtphelper[stderr]: " + data);
      if (data[0] === "{" && data[data.length-1] === "}") {
        var e;
        try {
          e = JSON.parse(data);
        } catch (x) {
          console.log(x);
          e = {}
        }
        switch (e.event) {
        case "DeviceAdded":
          if (MTPHelper.onDeviceAdded) MTPHelper.onDeviceAdded(e.deviceId);
          break;
        case "DeviceRemoved":
          if (MTPHelper.onDeviceRemoved) MTPHelper.onDeviceRemoved(e.deviceId);
          break;
        }
      }
    }
  },
  stdout_proc: function(data) {
    console.log("mtphelper[stdout]: " + data);
  },

  /* start MTP-helper exe
    @IN require('queue') object
    @return    Promise-object
    @Promise-resolve String of MTPHelper-version
  */
  start: function(queue) {
    if (queue) {
      MTPHelper.queue = queue({concurrency: 1});
    }
    if (!MTPHelper.queue) {
      console.log("specify `require('queue')` first.");
      return Promise.reject();
    }
    return new Promise((resolve, reject)=>{
      MTPHelper.queue.push((cb)=>{
        if (MTPHelper.child === null) {
          console.log("mtphelper: spawn '" + MTPHelper.executable + "'");
          const child = require('child_process');
          const readline = require('readline');
          MTPHelper.child = child.execFile(MTPHelper.executable);
          MTPHelper.child.readlineIn  = readline.createInterface(MTPHelper.child.stdout, {});
          MTPHelper.child.readlineIn.on('line', MTPHelper.stdout_proc);
          MTPHelper.child.readlineErr = readline.createInterface(MTPHelper.child.stderr, {});
          MTPHelper.child.readlineErr.on('line', MTPHelper.stderr_proc);
          child.execFile(MTPHelper.executable, ["-v"], (err, sout, serr)=>{
            MTPHelper.helper_version = sout.split("\n")[0];
            resolve(MTPHelper.helper_version);
          });
        }
        cb();
      });
      MTPHelper.queue.start();
    });
  },

  /* stop MTP-helper exe
    @return    Promise-object
    @Promise-resolve (empty)
  */
  stop: function() {
    return new Promise((resolve, reject)=>{
      MTPHelper.queue.push((cb)=>{
        if (MTPHelper.child) {
          MTPHelper.child.stdin.end();
          MTPHelper.child = null;
        }
        cb()
        resolve();
      });
      MTPHelper.queue.start();
    });
  },

  /* request MTP-helper command
    @return    Promise-object
    @Promise-resolve Hash of result
    @Promise-reject  Exception
  */
  request: function(command) {
    return new Promise((resolve, reject)=>{
      MTPHelper.queue.push((cb)=>{
        MTPHelper.child.readlineIn.once('line', (data)=>{
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
          finally {
            cb()
          }
        });
        MTPHelper.child.stdin.write(command+"\n");
      });
      MTPHelper.queue.start();
    });
  },

  /* get deviceList and deviceInfo
    @return    Promise-object
    @Promise-resolve Hash of devices  or {deviceId: {status: != OK }}
    @Promise-reject  Exception
  */
  deviceList: function() {
    return new Promise((resolve, reject)=>{
      MTPHelper.request("deviceList").then((data)=>{
        var result = {};
        if (data.status !== "OK") {
          reject(data);
          return;
        }
        Promise.all(data.devices.map((did)=>{
          if (did === undefined) {
            return undefined;
          }
          return new Promise((resolve2, reject2)=>{
            var dev = new MTPDevice(did);
            dev.deviceInfo().then((info)=>{
              result[did] = info;
              resolve2();
            });
          });
        })).then(()=>{
          resolve(result);
        });
      }).catch((e)=>{
        reject(e);
      });
    });
  },

  Device: MTPDevice,
  platform: process.platform,
  dirname: __dirname,
  process: process,
  global: global,
  executable: __dirname + "/MtpHelper" + ((process.platform=="win32")? ".exe": "")
};


/* get dveiceInfo
  @return    Promise-object
  @Promise-resolve Hash of result
  @Promise-reject  Exception
*/
MTPDevice.prototype.deviceInfo = function() {
  return MTPHelper.request("deviceInfo " + this.deviceId);
}

/* get deviceProp desc
  @return    Promise-object
  @Promise-resolve Hash of result
  @Promise-reject  Exception
*/
MTPDevice.prototype.getPropDesc = function(propName) {
  return MTPHelper.request("desc " + this.deviceId + " " + propName);
}

/* get deviceProp value
  @return    Promise-object
  @Promise-resolve Hash of result
  @Promise-reject  Exception
*/
MTPDevice.prototype.getPropValue = function(propName) {
  return MTPHelper.request("get " + this.deviceId + " " + propName);
}

/* set deviceProp value
  @return    Promise-object
  @Promise-resolve Hash of result
  @Promise-reject  Exception
*/
MTPDevice.prototype.setPropValue = function(propName, propValue) {
  return MTPHelper.request("set " + this.deviceId + " " + propName + " " + propValue);
}

/* send config object
  @return    Promise-object
  @Promise-resolve Hash of result
  @Promise-reject  Exception
*/
MTPDevice.prototype.sendConfigObject = function(filename) {
  return MTPHelper.request("sendConfig " + this.deviceId + " " + filename);
}

/* get config object
  @return    Promise-object
  @Promise-resolve Hash of result
  @Promise-reject  Exception
*/
MTPDevice.prototype.getConfigObject = function(filename) {
  return MTPHelper.request("getConfig " + this.deviceId + " " + filename);
}

/* update firmware
  @return    Promise-object
  @Promise-resolve Hash of result
  @Promise-reject  Exception
*/
MTPDevice.prototype.firmwareUpdate = function(filename) {
  return MTPHelper.request("firmwareUpdate " + this.deviceId + " " + filename);
}

module.exports = MTPHelper;
