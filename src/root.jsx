//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './js/containers/AppContainer';
import Notify from './js/components/Notify';

import {remote as Remote} from 'electron'
import FS from 'fs';
import path from 'path';
import FsBackend from 'i18next-node-fs-backend';
import Queue from 'queue';

const {app, shell} = Remote;
const Argv = Remote.getGlobal('sharedObject').ARGV;
const EnvLang = (Argv.lang || app.getLocale()).substring(0,2);
const Lang = ['ja', 'en'].find(_=>_===EnvLang) || 'en';
i18next.use(FsBackend).init({
  lng: Lang,
  fallbackLng: ['en'],
  debug: false, // false for suppress "i18next::translator: missingKey" messages
  backend: {
    loadPath: __dirname + "/assets/i18nlocales/{{lng}}/{{ns}}.json",
  }
}, (err, t)=>{
  ReactDOM.render(<AppContainer Argv={Argv} />, document.getElementById('root'));
});


let MTP, MTPHelperVersion;
try {
  MTP = require(__dirname + '/lib/mtphelper/mtphelper.js');
}
catch (e) {
  MTP = require(__dirname + '/../lib/mtphelper/mtphelper.js');
}
MTP.start(Queue).then((version)=>{
  MTPHelperVersion = version;
});

const PackageVersion = require(__dirname + '/package.json').version;

import DevicePropMock from './js/device_prop_mock';
if (Argv.mtpfixture) {
  const MtpFixture = require(path.resolve(Argv.mtpfixture));
  DevicePropMock(MTP, MtpFixture);
}
if (Argv.mtpfixture || Argv.dialogfixture) {
  Notify.disappear_delay = 200;
  Notify.disappear_timer = 200;
}
