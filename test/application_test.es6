//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import {expect, app, importTest} from './common';
import * as Actions from './steps/actions';


describe('Application', ()=>{
  before(()=>{
    // this.timeout(3000);
    return app.start().then(()=>{
      return app.client.waitUntilWindowLoaded();
    });
  });

  describe('Application view.', ()=>{
    it('BrowserWindow is visible.', ()=>{
      return expect(app.browserWindow.isVisible()).eventually.to.equal(true);
    });

    // see http://webdriver.io/api.html
    it('Application title is `RICOH R Console`.', ()=>{
      return expect(app.client.getTitle()).eventually.to.equal('RICOH R Console');
    });
  });

  importTest('./add_and_remove_devices');
  importTest('./device_is_not_connected');

  describe('When the device is connected.', ()=>{
    before(()=>{
      return Actions.DeviceList.click().then(()=>{
        return Actions.DeviceList.Items.click(1).waitForVisible('#settingItems');
      });
    });

    importTest('./contents_when_device_connected');
    importTest('./edit_params');
    importTest('./reset_to_default');
    importTest('./preset_operations');
    importTest('./save_and_load');
    importTest('./firmware_update');
    importTest('./startup_config');
  });

  after(()=>{
    return app.stop();
  });
});
