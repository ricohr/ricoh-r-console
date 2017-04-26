//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import {remote as Remote} from 'electron'
import React from 'react';
import ModalFrame from '../components/ModalFrame';
import * as I18N from '../components/i18n';
import Notify from '../components/Notify';

import DialogMock from '../dialog_mock';

const {dialog} = Remote;
const currentWindow = Remote.getCurrentWindow();
const dialogfixture = Remote.getGlobal('sharedObject').ARGV.dialogfixture;
if (dialogfixture) {
  DialogMock(dialogfixture);
}

const download_url = 'https://github.com/ricohr/r-dk-firmware/releases';


export default class FirmwreUpdate extends ModalFrame {
  show() {
    this.refs.downloadFirmware.show();
  }

  onOpenDownloadUrl() {
    Remote.shell.openExternal(download_url);
  }

  onContinue() {
    const opt = {
            title: i18next.t('label.fileFirmwareUpdate'),
            filters: [{name: 'Firmare file', extensions: ['frm']}]
          },
          filenames = dialog.showOpenDialog(currentWindow, opt);
    if (filenames && filenames.length > 0) {
      this.refs.uploading.show();
      const deviceId = this.props.appStore.get('current').deviceId;
      (new MTP.Device(deviceId)).firmwareUpdate(filenames[0]).then((result)=>{
        this.refs.uploading.hide();
        switch (result.status) {
        case 'Invalid file name':
          return this.refs.invalidFileName.show();
        case 'Invalid file content':
          return this.refs.invalidFileContent.show();
        case 'OK':
          return this.refs.afterUpload.show();
        case 'FAILED(2019)':
          return Notify.show(result.status, 'failedWhileRecording', {i18n_prefix:'notify'});
        default:
          Notify.showDanger('configObjectStoreFailed');
        }
      })
    }
  }

  render() {
    return (
      <div>
        <ModalFrame ref='downloadFirmware' modalId='firmwareUpdateGuide-downloadFirmware' {...this.props}
          close='label.cancel' continue='label.continue' onContinue={this.onContinue.bind(this)}>
          <I18N.Div data-i18n='firmwareUpdate.downloadFirmware'/>
          <a className='download-url' href='#' onClick={this.onOpenDownloadUrl.bind(this)}>{download_url}</a>
        </ModalFrame>

        <ModalFrame ref='uploading' modalId='firmwareUpdateGuide-uploading' {...this.props} close={false}>
          <I18N.Div data-i18n='firmwareUpdate.uploading'/>
        </ModalFrame>

        <ModalFrame ref='invalidFileName' modalId='firmwareUpdateGuide-invalidFileName' {...this.props}
          close='label.retry' onClose={this.onContinue.bind(this)}>
          <I18N.Div data-i18n='firmwareUpdate.invalidFileName'/>
        </ModalFrame>

        <ModalFrame ref='invalidFileContent' modalId='firmwareUpdateGuide-invalidFileContent' {...this.props}
          close='label.retry' onClose={this.onContinue.bind(this)}>
          <I18N.Div data-i18n='firmwareUpdate.invalidFileContent'/>
        </ModalFrame>

        <ModalFrame ref='afterUpload' modalId='firmwareUpdateGuide-afterUpload' {...this.props}>
          <I18N.DivHTML data-i18n='firmwareUpdate.afterUpload'/>
        </ModalFrame>
      </div>
    );
  }
}
