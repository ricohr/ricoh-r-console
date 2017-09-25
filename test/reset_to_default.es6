//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import {expect, app, Sleep} from './common';
import * as Helper from './helper';
import * as Actions from './steps/actions';


describe('Reset to default.', ()=>{
  it('When you click `Reset to default`, the modal is displayed.', ()=>{
    return Actions.Initialize.click().waitForVisible('#initializeProps');
  });

  it('When you click cancel, the modal is disappeared.', ()=>{
    return Actions.Initialize.Modal.Cancel.click().then(()=>{
      return Helper.wait_for_unvisible('#initializeProps');
    });
  });

  describe('Exec reset.', ()=>{
    let currentProps;
    before(()=>{
      return Actions.Initialize.click().waitForVisible('#initializeProps').then(()=>{
        return Actions.Initialize.Modal.Continue.click();
      }).then(Sleep(1500)).then(()=>{
        return Helper.wait_close_all();
      }).then(()=>{
        return Helper.MTPMock_PropValue();
      }).then(props=>{
        currentProps = props;
      });
    });

    describe('WhiteBalance', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'WhiteBalance');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_button_states('WhiteBalance', [false, true]);
      });
    });

    describe('RGBGain', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'RGBGain');
      });
      it('becomes to default state', ()=>{
        return Promise.all([
          Helper.expect_RGBGain_slider_state(currentProps, 'red'),
          Helper.expect_RGBGain_slider_state(currentProps, 'blue')
        ]);
      });
      it('and becomes disable.', ()=>{
        return app.client.getAttribute('[data-deviceProperty="RGBGain"] .slider', 'class').then(elms=>{
          return Promise.all(elms.map(elm=>expect(elm).to.string("slider-disabled")));
        });
      })
    });

    describe('ExposureBiasCompensation', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'ExposureBiasCompensation');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_slider_state(currentProps, 'ExposureBiasCompensation');
      });
    });

    describe('FlickerReduction', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'FlickerReduction');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_button_states('FlickerReduction', [true, false]);
      });
    });

    describe('ZenithMode', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'ZenithMode');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_button_states('ZenithMode', [true, false, false, false]);
      });
    });

    describe('VideoOutput', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'VideoOutput');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_button_states('VideoOutput', [true, false]);
      });
    });

    describe('WDR', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'WDR');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_button_states('WDR', [true, false, false, false]);
      });
    });

    describe('StitchMode', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'StitchMode');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_button_states('StitchMode', [true, false]);
      });
      it('becomes to `retryDetect` is disabled', ()=>{
        return expect(app.client.getAttribute('[data-deviceProperty="StitchMode"] button', 'disabled'))
          .eventually.to.equal('true');
      });
    });

    describe('VideoBitrate', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'VideoBitrate');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_button_states('VideoBitrate', [false, true]);
      });
    });

    describe('AudioOutput', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'AudioOutput');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_button_states('AudioOutput', [false, true]);
      });
    });

    describe('AudioInputGain', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'AudioInputGain');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_slider_state(currentProps, 'AudioInputGain');
      });
    });

    describe('StandbyLedBrightness', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'StandbyLedBrightness');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_slider_state(currentProps, 'StandbyLedBrightness');
      });
    });

    describe('TransmittingLedBrightness', ()=>{
      it('becomes to default value.', ()=>{
        Helper.expect_mtpprop_value_is_default(currentProps, 'TransmittingLedBrightness');
      });
      it('becomes to default state', ()=>{
        return Helper.expect_slider_state(currentProps, 'TransmittingLedBrightness');
      });
    });
  });
});
