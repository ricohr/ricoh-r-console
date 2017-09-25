//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import {expect, app} from './common';
import * as Helper from './helper';
import * as Actions from './steps/actions';


describe('Contents when the device is connected.', ()=>{
  describe('navBar', ()=>{
    describe('file menu', ()=>{
      it('At first, the file menu is not displayed.', ()=>{
        return expect(app.client.isVisible('#fileMenu+.dropdown-menu')).eventually.to.equal(false);
      });

      describe('When you click fileMenu, items are displayed.', ()=>{
        before(()=>{
          return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu');
        });

        it('configStore is visible.', ()=>{
          return expect(app.client.isVisible('#configStore')).eventually.to.equal(true);
        });

        it('configRemove is visible.', ()=>{
          return expect(app.client.isVisible('#configRemove')).eventually.to.equal(true);
        });

        it('fileSaveAs is visible.', ()=>{
          return expect(app.client.isVisible('#fileSaveAs')).eventually.to.equal(true);
        });

        it('fileSaveAs is visible.', ()=>{
          return expect(app.client.isVisible('#fileLoadFrom')).eventually.to.equal(true);
        });

        it('firmwareUpdate is visible.', ()=>{
          return expect(app.client.isVisible('#firmwareUpdate')).eventually.to.equal(true);
        });

        after(()=>{
          return Actions.Menus.File.click().then(()=>{
            return Helper.wait_for_unvisible('#fileMenu+.dropdown-menu');
          });
        });
      });
    });

    describe('about menu', ()=>{
      it('When you click about, About-modal is displayed.', ()=>{
        return Actions.Menus.About.click().waitForVisible('#aboutModal');
      });

      it('About-modal contain MtpHelper version.', ()=>{
        return expect(app.client.getText("#mtphelper_version")).eventually.to.match(/^MtpHelper(\.exe)? version \d/);
      });

      it('When you click close, About-modal is disappeared.', ()=>{
        return Actions.About.Close.click().then(()=>{
          return Helper.wait_for_unvisible('#aboutModal');
        });
      });

      after(()=>{
        return Helper.wait_close_all();
      });
    });
  });

  describe('contents', ()=>{
    describe('deviceInfo', ()=>{
      it('button is visible.', ()=>{
        return expect(app.client.isVisible('#deviceInfo')).eventually.to.equal(true);
      });

      it('When you click deviceInfo, deviceInfo-modal is displayed.', ()=>{
        return Actions.DeviceInfo.click().waitForVisible('#deviceInfoModal');
      });

      it('deviceInfo-modal contain modal label.', ()=>{
        return expect(app.client.getText('#deviceInfoModal [data-i18n="label.DeviceInfo"]')).eventually.to.not.equal("");
      });

      it('deviceInfo-modal contain DeviceInfo-Manufacturer label.', ()=>{
        return expect(app.client.getText('#deviceInfoModal label[for="DeviceInfo-Manufacturer"]')).eventually.to.not.equal("");
      });
      it('deviceInfo-modal contain DeviceInfo-Manufacturer.', ()=>{
        return expect(app.client.getText('#deviceInfoModal label[for="DeviceInfo-Manufacturer"]+div')).eventually.to.not.equal("");
      });

      it('deviceInfo-modal contain DeviceInfo-Model label.', ()=>{
        return expect(app.client.getText('#deviceInfoModal label[for="DeviceInfo-Model"]')).eventually.to.not.equal("");
      });
      it('deviceInfo-modal contain DeviceInfo-Model.', ()=>{
        return expect(app.client.getText('#deviceInfoModal label[for="DeviceInfo-Model"]+div')).eventually.to.not.equal("");
      });

      it('deviceInfo-modal contain DeviceInfo-SerialNumber label.', ()=>{
        return expect(app.client.getText('#deviceInfoModal label[for="DeviceInfo-SerialNumber"]')).eventually.to.not.equal("");
      });
      it('deviceInfo-modal contain DeviceInfo-SerialNumber.', ()=>{
        return expect(app.client.getText('#deviceInfoModal label[for="DeviceInfo-SerialNumber"]+div')).eventually.to.not.equal("");
      });

      it('deviceInfo-modal contain DeviceInfo-DeviceVersion label.', ()=>{
        return expect(app.client.getText('#deviceInfoModal label[for="DeviceInfo-DeviceVersion"]')).eventually.to.not.equal("");
      });
      it('deviceInfo-modal contain DeviceInfo-Manufacturer.', ()=>{
        return expect(app.client.getText('#deviceInfoModal label[for="DeviceInfo-DeviceVersion"]+div')).eventually.to.not.equal("");
      });

      it('When you click close, deviceInfo-modal is disappeared.', ()=>{
        return Actions.DeviceInfo.Modal.Close.click().then(()=>{
          return Helper.wait_for_unvisible('#deviceInfoModal');
        });
      });

      after(()=>{
        return Helper.wait_close_all();
      });
    });

    describe('preset list', ()=>{
      it('label of preset list is visible.', ()=>{
        return expect(app.client.isVisible('label[for="presetList"]')).eventually.to.equal(true);
      });
      it('preset list is visible.', ()=>{
        return expect(app.client.isVisible('#presetList')).eventually.to.equal(true);
      });
    });

    describe('Setting items', ()=>{
      it('image icon is visible.', ()=>{
        return expect(app.client.isVisible('.icon-image')).eventually.to.equal(true);
      });

      describe('StillCaptureMode', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="StillCaptureMode-group"]')).eventually.to.equal(true);
        });

        it('mode text is visible.', ()=>{
          return expect(app.client.isVisible('label[for="StillCaptureMode-group"]+div div')).eventually.to.equal(true);
        });

        it('reset button is visible.', ()=>{
          return expect(app.client.isVisible('label[for="StillCaptureMode-group"]+div button')).eventually.to.equal(true);
        });
      });

      describe('WhiteBalance', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="WhiteBalance-group"]')).eventually.to.equal(true);
        });

        it('2-radios are visible.', ()=>{
          return expect(app.client.isVisible('label[for="WhiteBalance-group"]+div input[type="radio"]+span')).eventually.to.eql([true, true]);
        });
      });

      describe('RGBGain', ()=>{
        describe('R', ()=>{
          it('label is visible.', ()=>{
            return expect(app.client.isVisible('label[for="RGBGain-red-group"]')).eventually.to.equal(true);
          });

          it('slider is visible.', ()=>{
            return expect(app.client.isVisible('label[for="RGBGain-red-group"]+.slider')).eventually.to.equal(true);
          });
        });

        describe('G', ()=>{
          it('label is visible.', ()=>{
            return expect(app.client.isVisible('label[for="RGBGain-green-group"]')).eventually.to.equal(true);
          });

          it('static text is visible.', ()=>{
            return expect(app.client.isVisible('label[for="RGBGain-green-group"]+.fixed-slider-value')).eventually.to.equal(true);
          });
        });

        describe('B', ()=>{
          it('label is visible.', ()=>{
            return expect(app.client.isVisible('label[for="RGBGain-blue-group"]')).eventually.to.equal(true);
          });

          it('slider is visible.', ()=>{
            return expect(app.client.isVisible('label[for="RGBGain-blue-group"]+.slider')).eventually.to.equal(true);
          });
        });
      });

      describe('ExposureBiasCompensation', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="ExposureBiasCompensation-group"]')).eventually.to.equal(true);
        });

        it('slider is visible.', ()=>{
          return expect(app.client.isVisible('label[for="ExposureBiasCompensation-group"]+div .slider')).eventually.to.equal(true);
        });
      });

      describe('FlickerReduction', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="FlickerReduction-group"]')).eventually.to.equal(true);
        });

        it('2-radios are visible.', ()=>{
          return expect(app.client.isVisible('label[for="FlickerReduction-group"]+div input[type="radio"]+span')).eventually.to.eql([true, true]);
        });
      });

      describe('ZenithMode', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="ZenithMode-group"]')).eventually.to.equal(true);
        });

        it('4-radios are visible.', ()=>{
          return expect(app.client.isVisible('label[for="ZenithMode-group"]+div input[type="radio"]+span')).eventually.to.eql([true, true, true, true]);
        });
      });

      describe('VideoOutput', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="VideoOutput-group"]')).eventually.to.equal(true);
        });

        it('2-radios are visible.', ()=>{
          return expect(app.client.isVisible('label[for="VideoOutput-group"]+div input[type="radio"]+span')).eventually.to.eql([true, true]);
        });

        it('2-images are visible.', ()=>{
          return expect(app.client.isVisible('label[for="VideoOutput-group"]+div img')).eventually.to.eql([true, true]);
        });
      });

      describe('WDR', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="WDR-group"]')).eventually.to.equal(true);
        });

        it('4-radios are visible.', ()=>{
          return expect(app.client.isVisible('label[for="WDR-group"]+div input[type="radio"]+span')).eventually.to.eql([true, true, true, true]);
        });
      });

      describe('StitchMode', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="StitchMode-group"]')).eventually.to.equal(true);
        });

        it('2-radios are visible.', ()=>{
          return expect(app.client.isVisible('label[for="StitchMode-group"]+div input[type="radio"]+span')).eventually.to.eql([true, true]);
        });

        it('retry button is visible.', ()=>{
          return expect(app.client.isVisible('label[for="StitchMode-group"]+div button')).eventually.to.equal(true);
        });
      });

      describe('VideoBitrate', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="VideoBitrate-group"]')).eventually.to.equal(true);
        });

        it('2-radios are visible.', ()=>{
          return expect(app.client.isVisible('label[for="VideoBitrate-group"]+div input[type="radio"]+span')).eventually.to.eql([true, true]);
        });
      });

      it('image icon is visible.', ()=>{
        return expect(app.client.isVisible('.icon-volume')).eventually.to.equal(true);
      });

      describe('AudioOutput', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="AudioOutput-group"]')).eventually.to.equal(true);
        });

        it('2-radios are visible.', ()=>{
          return expect(app.client.isVisible('label[for="AudioOutput-group"]+div input[type="radio"]+span')).eventually.to.eql([true, true]);
        });
      });

      describe('AudioInputGain', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="AudioInputGain-group"]')).eventually.to.equal(true);
        });

        it('slider is visible.', ()=>{
          return expect(app.client.isVisible('label[for="AudioInputGain-group"]+div .slider')).eventually.to.equal(true);
        });
      });

      it('image icon is visible.', ()=>{
        return expect(app.client.isVisible('.icon-led')).eventually.to.equal(true);
      });

      describe('StandbyLedBrightness', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="StandbyLedBrightness-group"]')).eventually.to.equal(true);
        });

        it('slider is visible.', ()=>{
          return expect(app.client.isVisible('label[for="StandbyLedBrightness-group"]+div .slider')).eventually.to.equal(true);
        });
      });

      describe('TransmittingLedBrightness', ()=>{
        it('label is visible.', ()=>{
          return expect(app.client.isVisible('label[for="TransmittingLedBrightness-group"]')).eventually.to.equal(true);
        });

        it('slider is visible.', ()=>{
          return expect(app.client.isVisible('label[for="TransmittingLedBrightness-group"]+div .slider')).eventually.to.equal(true);
        });
      });

      it('items order with className is valid.', ()=>{
        return app.client.getAttribute('#settingItems >*', 'class').then((classes)=>{
          return expect(classes).to.eql([
            'group-icon icon-image',
            'row form-group',
            'row form-group',
            'row form-group',
            'row form-group',
            'row form-group',
            'row form-group',
            'row form-group',
            'row form-group',
            'row form-group',
            'row form-group',
            '',
            'group-icon icon-volume',
            'row form-group',
            'row form-group',
            '',
            'group-icon icon-led',
            'row form-group',
            'row form-group',
          ]);
        });
      });
    });

    it('HowToUse is hidden.', ()=>{
      return expect(app.client.isVisible('#howToUse')).eventually.to.equal(false);
    });
  });
});
