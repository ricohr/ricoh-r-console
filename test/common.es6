//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

import Chai from 'chai';
Chai.use(require('chai-as-promised'));
const expect = Chai.expect;
import Sleep from 'sleep-promise';
import path from 'path';
import {Application} from 'spectron';

const dialogFixtureName = path.join(__dirname, 'dialogFixture.json'),
      args = [
        '.',
        '--preset', path.join(__dirname, '/preset.json'),
        '--dialogfixture', dialogFixtureName,
        '--mtpfixture', path.join(__dirname, '/../test/devicePropFixture.json')
      ];


if (process.argv.find(_=>_==='--en')) {
  args.push('--lang');
  args.push('en');
}
if (process.argv.find(_=>_==='--ja')) {
  args.push('--lang');
  args.push('ja');
}


let execPath;
if (process.env.TEST_PACKAGED) {
  if (process.platform === 'win32') {
    execPath = path.join(__dirname, '../dist/win-ia32-unpacked/RICOH_R_Console.exe');
  } else {
    execPath = path.join(__dirname, '../dist/mac/RICOH_R_Console.app/Contents/MacOS/RICOH_R_Console');
  }
} else {
  const ext = (process.platform === 'win32')? '.cmd' : '';
  execPath = path.join(__dirname, '../node_modules/.bin/electron' + ext);
  args.unshift(path.join(__dirname, '..'));
}


const app = new Application({
  path: execPath,
  args
});


function importTest(path) {
  describe('', function () {
    require(path);
  });
}


module.exports = {expect, Sleep, app, importTest, dialogFixtureName};
