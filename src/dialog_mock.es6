//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import FS from 'fs';
import {remote as Remote} from 'electron'
const {dialog} = Remote;


function readFixture(dialogfixture) {
  try {
    return FS.readFileSync(dialogfixture, 'utf-8');
  } catch (e) {
    return null;
  }
};


export default function(dialogfixture) {
  dialog.showOpenDialog = function(currentWindow, opt) {
    const name = readFixture(dialogfixture);
    return name? [name]: [];
  };

  dialog.showSaveDialog = function(currentWindow, opt) {
    return readFixture(dialogfixture);
  };
};
