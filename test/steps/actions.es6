//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import {app} from '../common';


module.exports = {
  app,

  Menus: {
    File: {
      click: ()=>{
        return app.client.click('#fileMenu');
      },
      ConfigStore: {
        click: ()=>{
          return app.client.click('#configStore');
        },
      },
      ConfigRemove: {
        click: ()=>{
          return app.client.click('#configRemove');
        },
      },
      FileSaveAs: {
        click: ()=>{
          return app.client.click('#fileSaveAs');
        },
      },
      FileLoadFrom: {
        click: ()=>{
          return app.client.click('#fileLoadFrom');
        },
      },
      FirmwareUpdate: {
        click: ()=>{
          return app.client.click('#firmwareUpdate');
        },
      },
    },

    About: {
      click: ()=>{
        return app.client.click('[data-i18n="label.versionInfo"]');
      },
    },
  },

  DeviceList: {
    click: ()=>{
      return app.client.click('button[data-id="deviceList"]');
    },
    Items: {
      click: (item_index /* 1~ */)=>{
        if (!item_index) {
          item_index = 1;
        }
        return app.client.click('label[data-i18n="label.DeviceList"]+div .dropdown-menu.open a[tabindex="' + (parseInt(item_index)-1) + '"]')
      },
    },
  },

  DeviceInfo: {
    click: ()=>{
      return app.client.click('#deviceInfo');
    },
    Modal: {
      Close: {
        click: ()=>{
          return app.client.click('#deviceInfoModal button');
        },
      },
    },
  },

  About: {
    Close: {
      click: ()=>{
        return app.client.click('#aboutModal button');
      },
    },
  },

  FirmwareUpdate: {
    DownloadModal: {
      DownloadURL: {
        click: ()=>{
          return app.client.click('#firmwareUpdateGuide-downloadFirmware .download-url');
        },
      },
      Cancel: {
        click: ()=>{
          return app.client.click('#firmwareUpdateGuide-downloadFirmware button[data-i18n="label.cancel"]');
        },
      },
      Continue: {
        click: ()=>{
          return app.client.click('#firmwareUpdateGuide-downloadFirmware button[data-i18n="label.continue"]');
        },
      },
    },

    InvalidFileNameModal: {
      Retry: {
        click: ()=>{
          return app.client.click('#firmwareUpdateGuide-invalidFileName button[data-i18n="label.retry"]');
        },
      },
    },

    InvalidFileContentModal: {
      Retry: {
        click: ()=>{
          return app.client.click('#firmwareUpdateGuide-invalidFileContent button[data-i18n="label.retry"]');
        },
      },
    },

    AfterUploadModal: {
      Close: {
        click: ()=>{
          return app.client.click('#firmwareUpdateGuide-afterUpload button[data-i18n="label.close"]');
        },
      },
    }
  },

  Preset: {
    Load: {
      click: ()=>{
        return app.client.click('#presetList>div button');
      },
      Items: {
        click: (preset_index /* 1~ */)=>{
          if (!preset_index) {
            preset_index = 1;
          }
          return app.client.click('#presetList>div .dropdown-menu a[data-target="preset ' + (parseInt(preset_index)-1) + '"]');
        },
      },
    },

    Save: {
      click: ()=>{
        return app.client.click('#presetList>button');
      },
      Modal: {
        Items: {
          click: (item_index /* 1~ */)=>{
            if (!item_index) {
              item_index = 1;
            }
            return app.client.click('#PresetList-placeholder>label:nth-child(' + item_index + ')');
          },
        },
        Cancel: {
          click: ()=>{
            return app.client.click('#saveToPresetModal button[data-i18n="label.cancel"]');
          },
        },
        Save: {
          click: ()=>{
            return app.client.click('#saveToPresetModal button[data-i18n="label.save"]');
          },
        },
      },
    },
  },

  Initialize: {
    click: ()=>{
      return app.client.click('[data-deviceProperty="StillCaptureMode"] button');
    },
    Modal: {
      Cancel: {
        click: ()=>{
          return app.client.click('#initializeProps button[data-i18n="label.cancel"]');
        },
      },
      Continue: {
        click: ()=>{
          return app.client.click('#initializeProps button[data-i18n="label.continue"]');
        },
      },
    },
  },

  Props: {
    StitchMode: {
      Retry: {
        click: ()=>{
          return app.client.click('[data-deviceProperty="StitchMode"] button');
        },
      },
    },
    RGBGain: {
      click_slider: (color, position /* 0.0~1.0 */)=>{
        const selector = 'label[for="RGBGain-' + color + '-group"]+div .slider-track';
        return app.client.getElementSize(selector).then((size)=>{
          if (position === 1) {
            return app.client.leftClick(selector, size.width + 1, 0);
          } else {
            return app.client.leftClick(selector, size.width * position, 0);
          }
        });
      },
    },
    Items: {
      click: (propName, radioitem_index /* 1~ */)=>{
        return app.client.click('[data-deviceProperty="' + propName + '"] label:nth-child(' + radioitem_index + ')');
      },
      click_slider: (propName, position /* 0.0~1.0 */)=>{
        const selector = '[data-deviceProperty="' + propName + '"] .slider-track';
        return app.client.getElementSize(selector).then((size)=>{
          if (position === 1) {
            return app.client.leftClick(selector, size.width + 1, 0);
          } else {
            return app.client.leftClick(selector, size.width * position, 0);
          }
        });
      },
    },
  },
}
