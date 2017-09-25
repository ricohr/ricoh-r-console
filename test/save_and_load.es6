//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import FS from 'fs';
import {expect, app, Sleep} from './common';
import * as Helper from './helper';
import * as Actions from './steps/actions';


describe('Save and load settings.', ()=>{
  before(()=>{
    // Exec Reset to default.
    return Actions.Initialize.click().waitForVisible('#initializeProps').then(()=>{
      return Actions.Initialize.Modal.Continue.click();
    }).then(()=>{
      return Helper.wait_for_unvisible('#initializeProps');
    }).then(()=>{
      return Helper.wait_close_all();
    });
  });

  describe('Save settings.', ()=>{
    let defaultValues;
    before(()=>{
      return Helper.MTPMock_PropValue().then((props)=>{
        defaultValues = Helper.CollectCurrentsFromProps(props);
      });
    });

    it('When you click fileSaveAs and specifying the file, settings are saved to file.', ()=>{
      const savepath = Helper.SetDialogFilename('savefile.json');
      try {
        FS.unlinkSync(savepath);
      } catch (e) {
      }
      return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu').then(()=>{
        return Actions.Menus.File.FileSaveAs.click();
      }).then(Sleep(500)).then(()=>{
        const data = JSON.parse(FS.readFileSync(savepath, 'utf-8'));
        return expect(data).to.deep.eql(defaultValues);
      });
    });
  });

  describe('Load settings.', ()=>{
    let currentProps;
    let answer;
    before(()=>{
      return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu');
    });

    it('When you click fileSaveAs and specifying the file, settings are reflected.', ()=>{
      const loadpath = Helper.SetDialogFilename('../test/nonDefaultFixture.json');
      return Actions.Menus.File.FileLoadFrom.click().then(Sleep(500)).then(Sleep(1500)).then(()=>{
        return Helper.MTPMock_PropValue();
      }).then((props)=>{
        currentProps = props;
        const values = Helper.CollectCurrentsFromProps(props);
        answer = JSON.parse(FS.readFileSync(loadpath, 'utf-8'));
        return expect(values).to.deep.eql(answer);
      });
    });

    it('WhiteBalance is reflected.', ()=>{
      return Helper.expect_ui_state('WhiteBalance', answer, currentProps);
    });
    it('RGBGain is reflected.', ()=>{
      return Helper.expect_ui_state('RGBGain', answer, currentProps);
    });
    it('ExposureBiasCompensation is reflected.', ()=>{
      return Helper.expect_ui_state('ExposureBiasCompensation', answer, currentProps);
    });
    it('FlickerReduction is reflected.', ()=>{
      return Helper.expect_ui_state('FlickerReduction', answer, currentProps);
    });
    it('ZenithMode is reflected.', ()=>{
      return Helper.expect_ui_state('ZenithMode', answer, currentProps);
    });
    it('VideoOutput is reflected.', ()=>{
      return Helper.expect_ui_state('VideoOutput', answer, currentProps);
    });
    it('WDR is reflected.', ()=>{
      return Helper.expect_ui_state('WDR', answer, currentProps);
    });
    it('StitchMode is reflected.', ()=>{
      return Helper.expect_ui_state('StitchMode', answer, currentProps);
    });
    it('VideoBitrate is reflected.', ()=>{
      return Helper.expect_ui_state('VideoBitrate', answer, currentProps);
    });
    it('AudioOutput is reflected.', ()=>{
      return Helper.expect_ui_state('AudioOutput', answer, currentProps);
    });
    it('StandbyLedBrightness is reflected.', ()=>{
      return Helper.expect_ui_state('StandbyLedBrightness', answer, currentProps);
    });
    it('TransmittingLedBrightness is reflected.', ()=>{
      return Helper.expect_ui_state('TransmittingLedBrightness', answer, currentProps);
    });
  });

  after(()=>{
    return Helper.SetDialogFilename();
  });
});
