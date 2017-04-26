//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import {expect, app, Sleep} from './common';
import * as Helper from './helper';
import * as Actions from './steps/actions';


describe('Startup config.', ()=>{
  describe('Store settings to device.', ()=>{
    before(()=>{
      // Exec Reset to default.
      return Actions.Initialize.click().waitForVisible('#initializeProps').then(()=>{
        return Actions.Initialize.Modal.Continue.click();
      }).then(Sleep(1500)).then(()=>{
        return Helper.wait_for_unvisible('#initializeProps');
      }).then(()=>{
        return Helper.wait_close_all();
      });
    });

    it('When you click configStore, succeed-notify is visible.', ()=>{
      return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu').then(()=>{
        return Actions.Menus.File.ConfigStore.click()
          .waitForVisible(Helper.notify_selector('notify.configObjectStored'));
      });
    });

    it('... And settings are stored.', ()=>{
      let currentValues;
      return Helper.MTPMock_PropValue().then((props)=>{
        currentValues = Helper.CollectCurrentsFromProps(props);
        return Helper.MTPMock_SavedConfigObject();
      }).then((json)=>{
        const obj = JSON.parse(json);
        return expect(obj).to.deep.eql({SetDevicePropValue: currentValues});
      });
    });

    it('In recording, when you click configStore, failed-notify is visible.', ()=>{
      return Helper.MTPMock_SetRecordingState(true).then(()=>{
        return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu');
      }).then(()=>{
        return Actions.Menus.File.ConfigStore.click()
          .waitForVisible(Helper.notify_selector('notify.configObjectStoreFailed'));
      });
    });

    after(()=>{
      return Helper.MTPMock_SetRecordingState(false);
    })
  });

  describe('Remove settings to device.', ()=>{
    it('When you click configRemove, succeed-notify is visible.', ()=>{
      return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu').then(()=>{
        return Actions.Menus.File.ConfigRemove.click()
          .waitForVisible(Helper.notify_selector('notify.configObjectRemoved'));
      });
    });

    it('... And settings are removed.', ()=>{
      return Helper.MTPMock_SavedConfigObject().then((json)=>{
        return expect(json).to.equal('{}');
      });
    });

    it('In recording, when you click configRemove, failed-notify is visible.', ()=>{
      return Helper.MTPMock_SetRecordingState(true).then(()=>{
        return Actions.Menus.File.click().waitForVisible('#fileMenu+.dropdown-menu');
      }).then(()=>{
        return Actions.Menus.File.ConfigRemove.click()
          .waitForVisible(Helper.notify_selector('notify.configObjectRemoveFailed'));
      });
    });

    after(()=>{
      return Helper.MTPMock_SetRecordingState(false);
    })
  });
});
