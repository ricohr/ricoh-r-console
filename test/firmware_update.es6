//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import path from 'path';
import {expect, app, Sleep} from './common';
import * as Helper from './helper';
import * as Actions from './steps/actions';


describe('Firmware update.', ()=>{
  describe('Cancel when download modal.', ()=>{
    before(()=>{
      return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu');
    });

    it('When you click firmwareUpdate, download-modal is displayed.', ()=>{
      return Actions.Menus.File.FirmwareUpdate.click().waitForVisible('#firmwareUpdateGuide-downloadFirmware');
    });
    it('download-modal contains download URL.', ()=>{
      return expect(app.client.getText('#firmwareUpdateGuide-downloadFirmware .download-url'))
        .eventually.to.not.equal('');
    });
    it('... And clickable.', ()=>{
      return app.client.click('#firmwareUpdateGuide-downloadFirmware .download-url'); // just click.
    });
    it('When you cancel in the modal, download-modal is disappeared.', ()=>{
      return Actions.FirmwareUpdate.DownloadModal.Cancel.click().then(()=>{
        return Helper.wait_for_unvisible('#firmwareUpdateGuide-downloadFirmware');
      });
    });

    after(()=>{
      return Helper.wait_close_all();
    });
  });

  describe('When you cancel in the showOpenDialog.', ()=>{
    before(()=>{
      return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu').then(()=>{
        return Actions.Menus.File.FirmwareUpdate.click().waitForVisible('#firmwareUpdateGuide-downloadFirmware');
      });
    });

    it('When you click continue and cancel when showOpenDialog, modals are disappeared.', ()=>{
      Helper.SetDialogFilename();
      return Actions.FirmwareUpdate.DownloadModal.Continue.click().then(()=>{
        return Helper.wait_for_unvisible('#firmwareUpdateGuide-downloadFirmware');
      });
    });

    after(()=>{
      return Helper.wait_close_all();
    });
  });

  describe('When you specify a valid file.', ()=>{
    before(()=>{
      return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu').then(()=>{
        return Actions.Menus.File.FirmwareUpdate.click().waitForVisible('#firmwareUpdateGuide-downloadFirmware');
      });
    });

    it('When you click continue and specifying valid file, updaloading-modal is displayed, and afterUpload-modal is displayed.', ()=>{
      Helper.SetDialogFilename('dk1_v100.frm');
      return Actions.FirmwareUpdate.DownloadModal.Continue.click()
        .waitForVisible('#firmwareUpdateGuide-uploading')
        .waitForVisible('#firmwareUpdateGuide-afterUpload');
    });
    it('When you click close, afterUpload-modals are disappeared.', ()=>{
      return Actions.FirmwareUpdate.AfterUploadModal.Close.click().then(()=>{
        return Helper.wait_for_unvisible('#firmwareUpdateGuide-afterUpload');
      });
    });

    after(()=>{
      return Helper.wait_close_all();
    });
  });

  describe('When you specify a invalid file.', ()=>{
    before(()=>{
      return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu').then(()=>{
        return Actions.Menus.File.FirmwareUpdate.click().waitForVisible('#firmwareUpdateGuide-downloadFirmware');
      });
    });

    it('When you click continue and specifying a file with a wrong file name, invalidFileName-modal is displayed.', ()=>{
      Helper.SetDialogFilename('invalid.frm');
      return Actions.FirmwareUpdate.DownloadModal.Continue.click()
        .waitForVisible('#firmwareUpdateGuide-invalidFileName');
    });
    it('When you click retry and specifying an empty file is specified, invalidFileContent-modal is displayed.', ()=>{
      Helper.SetDialogFilename('empty.frm');
      return Actions.FirmwareUpdate.InvalidFileNameModal.Retry.click().then(()=>{
        return Helper.wait_for_unvisible('#firmwareUpdateGuide-invalidFileName');
      }).waitForVisible('#firmwareUpdateGuide-invalidFileContent');
    });
    it('When you click retry and cancel in showOpenDialog, modals are disappeared.', ()=>{
      Helper.SetDialogFilename();
      return Sleep(500).then(()=>{
        return Actions.FirmwareUpdate.InvalidFileContentModal.Retry.click();
      }).then(()=>{
        return Helper.wait_for_unvisible('#firmwareUpdateGuide-invalidFileContent');
      });
    });

    after(()=>{
      return Helper.wait_close_all();
    });
  });

  describe('When device is recording, failed-notify is visible.', ()=>{
    before(()=>{
      return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu').then(()=>{
        return Actions.Menus.File.FirmwareUpdate.click().waitForVisible('#firmwareUpdateGuide-downloadFirmware');
      }).then(()=>{
        return Helper.MTPMock_SetRecordingState(true);
      });
    });

    it('When you click continue and specifying valid file, updaloading-modal is displayed, and afterUpload-modal is displayed.', ()=>{
      Helper.SetDialogFilename('dk1_v100.frm');
      return Actions.FirmwareUpdate.DownloadModal.Continue.click()
        .waitForVisible(Helper.notify_selector('notify.FAILED(2019)'));
    });

    after(()=>{
      return Helper.MTPMock_SetRecordingState(false).then(()=>{
        return Helper.wait_close_all();
      });
    });
  });

  after(()=>{
    Helper.SetDialogFilename();
  });
});
