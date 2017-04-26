//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import {expect, app} from './common';


describe('When the device is not connected.', ()=>{
  describe('navBar', ()=>{
    it('No file menus.', ()=>{
      return expect(app.client.isVisible('#fileMenu')).eventually.to.equal(false);
    });

    it('No about menus.', ()=>{
      return expect(app.client.isVisible('[data-i18n="label.versionInfo"]')).eventually.to.equal(false);
    });
  });

  it('No modals.', ()=>{
    return app.client.getTagName('.modal').then(()=>{
      throw '.modal is exist';
    }).catch((e)=>{
      return expect(e.type).to.equal("NoSuchElement");
    });
  });

  describe('contents', ()=>{
    it('deviceInfo is hidden.', ()=>{
      return expect(app.client.isVisible('#deviceInfo')).eventually.to.equal(false);
    });

    it('label of preset list is hidden.', ()=>{
      return expect(app.client.isVisible('label[for="presetList"]')).eventually.to.equal(false);
    });
    it('preset list is hidden.', ()=>{
      return expect(app.client.isVisible('label[for="presetList"]+div>div')).eventually.to.equal(false);
    });
    it('save preset button is hidden.', ()=>{
      return expect(app.client.isVisible('label[for="presetList"]+div>button')).eventually.to.equal(false);
    });

    it('No setting items.', ()=>{
      return expect(app.client.isVisible('#settingItems')).eventually.to.equal(false);
    });

    it('HowToUse is visible.', ()=>{
      return expect(app.client.isVisible('#howToUse')).eventually.to.equal(true);
    });
  });
});
