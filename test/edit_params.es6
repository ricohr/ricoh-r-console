//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import {expect, app} from './common';
import * as Helper from './helper';
import * as Actions from './steps/actions';


describe('Edit parameters.', ()=>{
  describe('WhiteBalance', ()=>{
    it('When you click Manual, MTP.WhiteBalance becomes 1.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('WhiteBalance', 1, 1);
    })
    it('... And RGBGain appears.', ()=>{
      return app.client.getAttribute('[data-deviceProperty="RGBGain"] .slider', 'class').then(()=>{
        return true;
      }).catch((e)=>{
        throw '.RGBGain disappears';
      });
    })
    it('... And ColorTemperature disappears.', ()=>{
      return app.client.getAttribute('[data-deviceProperty="ColorTemperature"] .slider', 'class').then(()=>{
        throw '.ColorTemperature appears';
      }).catch((e)=>{
        return expect(e.type).to.equal("NoSuchElement");
      });
    })
    it('When you click Auto, MTP.WhiteBalance becomes 2.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('WhiteBalance', 2, 2);
    })
    it('... And RGBGain disappears.', ()=>{
      return app.client.getAttribute('[data-deviceProperty="RGBGain"] .slider', 'class').then(()=>{
        throw '.RGBGain appears';
      }).catch((e)=>{
        return expect(e.type).to.equal("NoSuchElement");
      });
    })
    it('... And ColorTemperature disappears.', ()=>{
      return app.client.getAttribute('[data-deviceProperty="ColorTemperature"] .slider', 'class').then(()=>{
        throw '.ColorTemperature appears';
      }).catch((e)=>{
        return expect(e.type).to.equal("NoSuchElement");
      });
    })
    it('When you click ColorTemperature, MTP.WhiteBalance becomes 32775.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('WhiteBalance', 3, 32775);
    })
    it('... And RGBGain disappears.', ()=>{
      return app.client.getAttribute('[data-deviceProperty="RGBGain"] .slider', 'class').then(()=>{
        throw '.RGBGain appears';
      }).catch((e)=>{
        return expect(e.type).to.equal("NoSuchElement");
      });
    })
    it('... And ColorTemperature appears.', ()=>{
      return app.client.getAttribute('[data-deviceProperty="ColorTemperature"] .slider', 'class').then(()=>{
        return true;
      }).catch((e)=>{
        throw '.ColorTemperature disappears';
      });
    })
  });

  describe('RGBGain', ()=>{
    before(()=>{
      // set WhiteBalance=Manual
      return Actions.Props.Items.click('WhiteBalance', 1);
    });
    it('When you click left-end of R, MTP.RGBGain.R becomes 0.', ()=>{
      return Helper.expect_current_value_when_RGBGain_slider_is_clicked('red', 0, /^0:/);
    });
    it('When you click right-end of R, MTP.RGBGain.R becomes 500.', ()=>{
      return Helper.expect_current_value_when_RGBGain_slider_is_clicked('red', 1, /^500:/);
    });
    it('When you click left-end of B, MTP.RGBGain.B becomes 0.', ()=>{
      return Helper.expect_current_value_when_RGBGain_slider_is_clicked('blue', 0, /:0$/);
    });
    it('When you click right-end of B, MTP.RGBGain.B becomes 500.', ()=>{
      return Helper.expect_current_value_when_RGBGain_slider_is_clicked('blue', 1, /:500$/);
    });
  });

  describe('ColorTemperature', ()=>{
    before(()=>{
      // set WhiteBalance=ColorTemperature
      return Actions.Props.Items.click('WhiteBalance', 3);
    });
    it('When you click left-end, MTP.ColorTemperature becomes 2500.', ()=>{
      return Helper.expect_current_value_when_slider_is_clicked('ColorTemperature', 0, 2500);
    });
    it('When you click right-end, MTP.ColorTemperature becomes 10000.', ()=>{
      return Helper.expect_current_value_when_slider_is_clicked('ColorTemperature', 1, 10000);
    });
  });

  describe('ExposureBiasCompensation', ()=>{
    it('When you click left-end, MTP.ExposureBiasCompensation becomes 2000.', ()=>{
      return Helper.expect_current_value_when_slider_is_clicked('ExposureBiasCompensation', 0, 2000);
    });
    it('When you click right-end, MTP.ExposureBiasCompensation becomes -2000.', ()=>{
      return Helper.expect_current_value_when_slider_is_clicked('ExposureBiasCompensation', 1, -2000);
    });
  });

  describe('FlickerReductionMode', ()=>{
    it('When you click Disable, MTP.FlickerReductionMode becomes 0.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('FlickerReductionMode', 1, 0);
    })
    it('When you click Enable, MTP.FlickerReductionMode becomes 1.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('FlickerReductionMode', 2, 1);
    })
  });

  describe('ZenithMode', ()=>{
    it('When you click OFF, MTP.ZenithMode becomes 0.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('ZenithMode', 1, 0);
    })
    it('When you click Auto, MTP.ZenithMode becomes 3.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('ZenithMode', 4, 3);
    })
  });

  describe('VideoOutput', ()=>{
    it('When you click 1920x1080, MTP.VideoOutput becomes 0.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('VideoOutput', 1, 0);
    })
    it('When you click 1920x960+120, MTP.VideoOutput becomes 1.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('VideoOutput', 2, 1);
    })
  });

  describe('WDR', ()=>{
    it('When you click OFF, MTP.WDR becomes 0.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('WDR', 1, 0);
    })
    it('When you click Strong, MTP.WDR becomes 3.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('WDR', 4, 3);
    })
  });

  describe('StitchMode', ()=>{
    it('When you click OFF, MTP.StitchMode becomes 0.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('StitchMode', 1, 0);
    })
    it('... And retryDetect-button becomes disable.', ()=>{
      return expect(app.client.getAttribute('[data-deviceProperty="StitchMode"] button', 'disabled'))
        .eventually.to.equal('true');
    });
    it('When you click Auto, MTP.StitchMode becomes 1.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('StitchMode', 2, 1);
    })
    it('... And retryDetect-button becomes enabled.', ()=>{
      return expect(app.client.getAttribute('[data-deviceProperty="StitchMode"] button', 'disabled'))
        .eventually.to.equal(null);
    });
    it('... And when you click retryDetect, increasing the number of MTP.StitchMode write operations.', ()=>{
      return Helper.MTPMock_PropValue('StitchMode', 'writeCount').then(prevCount=>{
        return Actions.Props.StitchMode.Retry.click().then(()=>{
          return Helper.MTPMock_PropValue('StitchMode', 'writeCount');
        }).then(writeCount=>{
          return expect(writeCount).to.be.equal(prevCount+1);
        });
      });
    });
  });

  describe('VideoBitrate', ()=>{
    it('When you click 8Mpbs, MTP.VideoBitrate becomes 8.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('VideoBitrate', 1, 8);
    })
    it('When you click 16Mpbs, MTP.VideoBitrate becomes 16.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('VideoBitrate', 2, 16);
    })
  });

  describe('AudioOutput', ()=>{
    it('When you click OFF, MTP.AudioOutput becomes 0.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('AudioOutput', 1, 0);
    })
    it('When you click ON, MTP.AudioOutput becomes 1.', ()=>{
      return Helper.expect_current_value_when_button_is_clicked('AudioOutput', 2, 1);
    })
  });

  describe('AudioInputGain', ()=>{
    it('When you click left-end, MTP.AudioInputGain becomes 0.', ()=>{
      return Helper.expect_current_value_when_slider_is_clicked('AudioInputGain', 0, 0);
    });
    it('When you click right-end, MTP.AudioInputGain becomes 29.', ()=>{
      return Helper.expect_current_value_when_slider_is_clicked('AudioInputGain', 1, 29);
    });
  });

  describe('StandbyLedBrightness', ()=>{
    it('When you click left-end, MTP.StandbyLedBrightness becomes 0.', ()=>{
      return Helper.expect_current_value_when_slider_is_clicked('StandbyLedBrightness', 0, 0);
    });
    it('When you click right-end, MTP.StandbyLedBrightness becomes 255.', ()=>{
      return Helper.expect_current_value_when_slider_is_clicked('StandbyLedBrightness', 1, 255);
    });
  });

  describe('TransmittingLedBrightness', ()=>{
    it('When you click left-end, MTP.TransmittingLedBrightness becomes 0.', ()=>{
      return Helper.expect_current_value_when_slider_is_clicked('TransmittingLedBrightness', 0, 0);
    });
    it('When you click right-end, MTP.TransmittingLedBrightness becomes 255.', ()=>{
      return Helper.expect_current_value_when_slider_is_clicked('TransmittingLedBrightness', 1, 255);
    });
  });

  after(()=>{
    return Helper.wait_close_all();
  });
});
