//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import FS from 'fs';
import {expect, app, Sleep} from './common';
import * as Helper from './helper';
import * as Actions from './steps/actions';


describe('Preset operations.', ()=>{
  describe('save preset', ()=>{
    describe('initial state', ()=>{
      it('When you click savePreset-button, modal is displayed.', ()=>{
        return Actions.Preset.Save.click().waitForVisible('#PresetList-placeholder>label');
      });

      it('preset list contains 10 presets.', ()=>{
        return app.client.getTagName('#PresetList-placeholder>label').then((tags)=>{
          return expect(tags.length).to.equal(10);
        });
      });

      it('preset list contains 10 presets - input tag.', ()=>{
        return expect(app.client.getAttribute('#PresetList-placeholder input', 'value')).eventually.to.eql([
          'preset 0',
          'preset 1',
          'preset 2',
          'preset 3',
          'preset 4',
          'preset 5',
          'preset 6',
          'preset 7',
          'preset 8',
          'preset 9',
        ]);
      });

      it('All update times are "-".', ()=>{
        return app.client.getHTML('#PresetList-placeholder>label>div:nth-last-child(1)').then((htmls)=>{
          return htmls.map(html=>{
            return expect(html).to.match(/^<div .+>-<\/div>$/);
          });
        });
      });

      it('When you click cancel, modal is disappeared.', ()=>{
        return Actions.Preset.Save.Modal.Cancel.click().then(()=>{
          return Helper.wait_for_unvisible('#saveToPresetModal');
        });
      });

      after(()=>{
        return Helper.wait_close_all();
      });
    });

    describe('save action.', ()=>{
      before(()=>{
        return Actions.Preset.Save.click().waitForVisible('#saveToPresetModal');
      });

      it('Even if the save-button is clicked, the modal does not disappeared.', ()=>{
        return Actions.Preset.Save.Modal.Save.click().waitForVisible('#saveToPresetModal');
      });

      it('The first preset can be selected.', ()=>{
        return Actions.Preset.Save.Modal.Items.click(1).then(()=>{
          return expect(app.client.isSelected('#PresetList-placeholder>label:nth-child(1) input')).eventually.to.equal(true);
        });
      });

      it('When you click save, the modal is disappeared.', ()=>{
        return Actions.Preset.Save.Modal.Save.click().then(()=>{
          return Helper.wait_for_unvisible('#saveToPresetModal');
        });
      });

      it('... And preset.json is saved.', ()=>{
        const data = require(__dirname + '/preset.json');
        expect(data).to.have.any.keys('preset 0', 'preset 1','preset 2','preset 3','preset 4','preset 5','preset 6','preset 7','preset 8','preset 9');
        expect(data['preset 0']).to.have.any.keys(
          '_last_updated',
          'WhiteBalance',
          'RGBGain',
          'ExposureBiasCompensation',
          'FlickerReduction',
          'ZenithMode',
          'VideoOutput',
          'WDR',
          'StitchMode',
          'VideoBitrate',
          'AudioOutput',
          'AudioInputGain',
          'StandbyLedBrightness',
          'TransmittingLedBrightness'
        );
        expect(data['preset 1']).to.be.empty;
        expect(data['preset 2']).to.be.empty;
        expect(data['preset 3']).to.be.empty;
        expect(data['preset 4']).to.be.empty;
        expect(data['preset 5']).to.be.empty;
        expect(data['preset 6']).to.be.empty;
        expect(data['preset 7']).to.be.empty;
        expect(data['preset 8']).to.be.empty;
        expect(data['preset 9']).to.be.empty;
      });

      after(()=>{
        FS.unlinkSync(__dirname + '/preset.json');
        return Helper.wait_close_all();
      });
    });

    describe('update dates.', ()=>{
      describe('preset load', ()=>{
        before(()=>{
          return Actions.Preset.Load.click().waitForVisible('#presetList>div .dropdown-menu');
        });

        it('The update date of the first preset is set.', ()=>{
          return app.client.getText('#presetList>div .dropdown-menu a[data-target="preset 0"] div:nth-last-child(1)').then((text)=>{
            return expect(text).to.match(/^\d+\/\d+\/\d+,? \d+:\d+( AM| PM|)$/);
          });
        });

        after(()=>{
          return app.client.click('.settings-backdrop').catch(()=>{
            return app.client.click('.dropdown-backdrop');
          }).then(()=>{
            return Helper.wait_close_all();
          });
        });
      });

      describe('preset save', ()=>{
        before(()=>{
          return Actions.Preset.Save.click().waitForVisible('#saveToPresetModal');
        });

        it('The update date of the first preset is set.', ()=>{
          return app.client.getText('#PresetList-placeholder>label:nth-child(1)>div:nth-last-child(1)').then((text)=>{
            return expect(text).to.match(/^\d+\/\d+\/\d+,? \d+:\d+( AM| PM|)$/);
          });
        });

        after(()=>{
          return Actions.Preset.Save.Modal.Cancel.click().then(()=>{
            return Helper.wait_close_all();
          });
        });
      });
    });
  });

  describe('load preset.', ()=>{
    describe('open and close.', ()=>{
      it('When you click preset-list button, preset list is displayed.', ()=>{
        return Actions.Preset.Load.click().waitForVisible('#presetList>div .dropdown-menu');
      });

      it('When you click preset-list button, preset list is disappeared.', ()=>{
        return app.client.click('.settings-backdrop').catch(()=>{
          return app.client.click('.dropdown-backdrop');
        }).then(()=>{
          return Helper.wait_for_unvisible('#presetList>div .dropdown-menu');
        });
      });
    });

    describe('load preset 0.', ()=>{
      let currentVideoOutputValue;
      before(()=>{
        return Helper.MTPMock_PropValue('VideoOutput', 'current').then((value)=>{
          currentVideoOutputValue = value;
          const v = 2 - parseInt(currentVideoOutputValue);
          return Actions.Props.Items.click('VideoOutput', v).then(Sleep(200));
        });
      });

      it ('When you click preset-list button, preset list is displayed.', ()=>{
        return Actions.Preset.Load.click().waitForVisible('#presetList>div .dropdown-menu');
      });

      it('When you click preset 0, preset list is disappeared.', ()=>{
        return Actions.Preset.Load.Items.click(1).then(()=>{
          return Helper.wait_for_unvisible('#presetList>div .dropdown-menu');
        });
      });

      describe('and becomes to preset value.', ()=>{
        let currentProps;
        before(()=>{
          return Helper.MTPMock_PropValue().then(props=>{
            currentProps = props;
          });
        });

        it('VideoOutput is back', ()=>{
          return Helper.expect_mtpprop_value(currentProps, 'VideoOutput', currentVideoOutputValue);
        });
      });
    })
  });
});
