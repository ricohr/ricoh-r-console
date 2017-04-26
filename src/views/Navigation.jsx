//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import {remote as Remote} from 'electron'
import FS from 'fs';
import React from 'react';
import {Navbar, Nav, NavDropdown, NavItem, MenuItem} from 'react-bootstrap';
import * as I18N from '../components/i18n';
import About from './About';
import FirmwreUpdate from './FirmwreUpdate';
import MtpActionCreator from '../data/MtpActionCreator';
import * as Utils from '../data/Utils';
import Notify from '../components/Notify';

import DialogMock from '../dialog_mock';

const {dialog} = Remote,
      currentWindow = Remote.getCurrentWindow(),
      dialogfixture = Remote.getGlobal('sharedObject').ARGV.dialogfixture;
if (dialogfixture) {
  DialogMock(dialogfixture);
}


export default class Navigation extends React.Component {
  onPropStore() {
    const data = Utils.collectValues();
    (new MtpActionCreator()).writeConfigObject({SetDevicePropValue: data}).then(()=>{
      Notify.showSuccess('configObjectStored');
    }).catch((status)=>{
      if (status === 'FAILED(2019)') {
        Notify.show('configObjectStoreFailed', 'failedWhileRecording', {i18n_prefix:'notify'});
      } else if (/^FAILED/.test(status)) {
        Notify.showDanger('configObjectStoreFailed');
      } else {
        Notify.showDanger('internalError', status, {i18n_prefix:null});
      }
    });
  }

  onConfigRemove() {
    (new MtpActionCreator()).removeConfigObject().then(()=>{
      Notify.showSuccess('configObjectRemoved');
    }).catch((status)=>{
      if (status === 'FAILED(2019)') {
        Notify.show('configObjectRemoveFailed', 'failedWhileRecording', {i18n_prefix:'notify'});
      } else if (/^FAILED/.test(status)) {
        Notify.showDanger('configObjectRemoveFailed');
      } else {
        Notify.showDanger('internalError', status, {i18n_prefix:null});
      }
    });
  }

  onFileSaveAs() {
    const opt = {
            title: i18next.t('label.fileSaveAs'),
            filters: [
              {name: 'JSON file', extensions: ['json']}
            ],
            properties: ['openFile']
          },
          filename = dialog.showSaveDialog(currentWindow, opt);
    if (filename) {
      const data = Utils.collectValues();
      FS.writeFile(filename, JSON.stringify(data, null, '  '), 'utf-8', (err)=>{
        if (!err) {
          Notify.showSuccess('fileSaved', filename, {i18n_prefix:null});
        } else {
          Notify.showDanger('fileSaveFailed', filename, {i18n_prefix:null});
        }
      });
    }
  }

  onFileLoadFrom() {
    const opt = {
            title: i18next.t('label.fileLoadFrom'),
            filters: [{name: 'JSON file', extensions: ['json']}]
          };
    if (process.platform !== 'darwin') {
      opt.filters.push({name: 'All files', extensions: ['*']});
    }
    const filenames = dialog.showOpenDialog(currentWindow, opt);
    if (filenames && filenames.length > 0) {
      const filename = filenames[0];
      FS.readFile(filename, 'utf-8', (err, data)=>{
        if (!err && data) {
          try {
            data = JSON.parse(data);
          } catch (e) {
            data = nil;
          }
        }
        if (!data || err || (data && (Object.keys(data).length === 0))) {
          Notify.showDanger('fileLoadFailed', filename, {i18n_prefix:null});
          return;
        }
        (new MtpActionCreator()).applyPropValues(data).then(()=>{
          Notify.showSuccess('fileLooaded', filename, {i18n_prefix:null});
        });
      });
    }
  }

  onFirmwreUpdate() {
    this.refs.firmwareUpdate.show();
  }

  onAbout() {
    this.refs.about.show();
  }

  render() {
    return (
      <Navbar fixedTop={true}>
        <Nav>
          <I18N.NavDropdown id='fileMenu' data-i18n='label.fileMenu' className='hide-when-nodevices'>
            <I18N.MenuItem id='configStore'    eventKey={1} data-i18n='label.configStore' onClick={this.onPropStore.bind(this)}/>
            <I18N.MenuItem id='configRemove'   eventKey={2} data-i18n='label.configRemove' onClick={this.onConfigRemove.bind(this)}/>
            <I18N.MenuItem divider />
            <I18N.MenuItem id='fileSaveAs'     eventKey={3} data-i18n='label.fileSaveAs' onClick={this.onFileSaveAs.bind(this)}/>
            <I18N.MenuItem id='fileLoadFrom'   eventKey={4} data-i18n='label.fileLoadFrom' onClick={this.onFileLoadFrom.bind(this)}/>
            <MenuItem divider />
            <I18N.MenuItem id='firmwareUpdate' eventKey={5} data-i18n='label.fileFirmwareUpdate' onClick={this.onFirmwreUpdate.bind(this)}/>
          </I18N.NavDropdown>
          <I18N.NavItem className='hide-when-nodevices' data-i18n='label.versionInfo' onClick={this.onAbout.bind(this)}/>
        </Nav>
        <About ref='about' {...this.props}/>
        <FirmwreUpdate ref='firmwareUpdate' {...this.props}/>
      </Navbar>
    );
  }
}
