//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import {expect, app} from './common';
import * as Helper from './helper';
import * as Actions from './steps/actions';


describe('Device removal / insertion.', ()=>{
  let SELECT_DEVICE, NO_DEVICES;

  before(()=>{
    return Helper.i18next_t('DeviceList.selectDevice').then(_=>{
      SELECT_DEVICE = _;
      return Helper.i18next_t('DeviceList.No Devices');
    }).then(_=>{
      NO_DEVICES = _;
      return Actions.DeviceList.click().waitForVisible('label[data-i18n="label.DeviceList"]+div .dropdown-menu');
    });
  });

  it('Initially, one device is displayed.', ()=>{
    return expect(app.client.getText('label[data-i18n="label.DeviceList"]+div .dropdown-menu a span:nth-child(1)'))
      .eventually.to.deep.eql([SELECT_DEVICE, 'R Development Kit - 12345678']);
  });

  it('Item is added when the device is connected.', ()=>{
    return Helper.MTPMock_AddDevice('0000-0000-0000-1000').then(()=>{
      return expect(app.client.getText('label[data-i18n="label.DeviceList"]+div .dropdown-menu a span:nth-child(1)'))
        .eventually.to.deep.eql([SELECT_DEVICE, 'R Development Kit - 12345678', 'R DEVELOPMENT KIT - 87654321']);
    });
  });

  it('Item is deleted when the device is deleted.', ()=>{
    return Helper.MTPMock_RemoveDevice('0000-0000-0000-1000').then(()=>{
      return expect(app.client.getText('label[data-i18n="label.DeviceList"]+div .dropdown-menu a span:nth-child(1)'))
        .eventually.to.deep.eql([SELECT_DEVICE, 'R Development Kit - 12345678']);
    });
  });

  it('`No devices` should be displayed when there are no more devices.', ()=>{
    return Helper.MTPMock_RemoveDevice('0000-0000-0000-0000').then(()=>{
      return expect(app.client.getText('label[data-i18n="label.DeviceList"]+div .dropdown-menu a span:nth-child(1)'))
        .eventually.to.eql(NO_DEVICES);
    });
  });

  after(()=>{
    return Helper.MTPMock_AddDevice('0000-0000-0000-0000').then(()=>{
      return Actions.DeviceList.click().catch(()=>{
        return app.client.click('.dropdown-backdrop');
      }).then(()=>{
        return Helper.wait_for_unvisible('label[data-i18n="label.DeviceList"]+div .dropdown-menu');
      })
    });
  });
});
