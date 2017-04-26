//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import {remote as Remote} from 'electron'
import FS from 'fs';
import AppStore from '../data/AppStore';
import AppActions from '../data/AppActions';
import MtpActionCreator from './MtpActionCreator';
import * as Utils from '../data/Utils';

const presetsFileName = Remote.getGlobal('sharedObject').ARGV.preset || Remote.app.getPath('userData') + '/presets.json';


class PresetActionCreator {
  load() {
    let presets;
    try {
      presets = require(presetsFileName);
    } catch (e) {
      presets = require(__dirname + '/../presets_template.json');
    }
    AppActions.setPresets(presets);
  }

  save(presetId, appStore) {
    const propValues = Utils.collectValues(),
          presets  = appStore.get('presets').toObject();
    propValues._last_updated = new Date();
    presets[presetId] = propValues;
    return new Promise((resolve)=>{
      FS.writeFile(presetsFileName, JSON.stringify(presets, null, '  '), 'utf-8', (err)=>{
        if (!err) {
          AppActions.updatePreset(presetId, propValues);
        }
        resolve(err);
      });
    })
  }
}

export default new PresetActionCreator();
