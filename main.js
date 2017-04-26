"use strict";
//
//  Copyright (c) 2017 Ricoh Company, Ltd. All Rights Reserved.
//  See LICENSE for more information.
//

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const FS = require('fs');

// command arguments.
const {version} = require(__dirname + '/package.json');
const Command = require('commander');
Command.version(version)
  .option('--width  <window width>',  'window width',  parseInt)
  .option('--height <window height>', 'window height', parseInt)
  .option('--lang   <ja|en>',         'select language')
  .option('--preset <path>',          'prsert file path')
  .option('--mtpfixture <path>',      'MTP fixture file path')
  .option('--dialogfixture <path>',   'Native dialog fixture file path')
  .option('-d, --debug',              'open DevTools')
try {
  Command.parse(process.argv);
} catch (e) {
  /* Discard the exception that occurs when process.argv is only $0.
  TypeError: Path must be a string. Received undefined
      at assertPath (path.js:7:11)
      at basename (path.js:1357:5)
      at Command.parse
   */
}
global.sharedObject = {
  ARGV: Command,
};
if (Command.mtpfixture) {
  global.sharedObject.MTPMock = {};
}


let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({width: Command.width || 900, height: Command.height || 905, icon: __dirname + '/assets/images/app.png'});

  // and load the index.html of the app.
  win.loadURL(`file://${__dirname}/main.html`);

  // Open the DevTools.
  if (Command.debug) {
    win.webContents.openDevTools();
  }

  // mkdtemp
  win.tmpdir = FS.mkdtempSync(app.getPath('temp') + 'electron.');

  // Emitted when the window is closed.
  win.on('closed', ()=>{
    // clean tempdir.
    for (var file of FS.readdirSync(win.tmpdir)) {
      FS.unlinkSync(`${win.tmpdir}/${file}`);
    }
    FS.rmdirSync(win.tmpdir);
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', ()=>{
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
