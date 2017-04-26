RICOH R Console
===============

You can adjust the parameters in the RICOH R Development Kit device.
Connect the device to a computer via USB to use this application.


How to use
----------

```
# install depends.
$ npm install

# update MtpHelper to latest release
$ npm run update-helper

# compile
$ npm run compile

# run application
$ npm run app
or
$ electron .

# make package (macOS dmg or Windows installer)
$ npm run package
```


Application Distribution
------------------------

* https://github.com/electron-userland/electron-builder
* https://github.com/electron-userland/electron-packager


Using libraries
---------------

* MtpHelper for OSX  
  https://github.com/ricohr/osx-mtphelper
* MtpHelper for Windows  
  https://github.com/ricohr/win-mtphelper
* WpdMtp.dll  
  https://github.com/kon0524/WpdMtp


Contributing
------------

Bug reports and pull requests are welcome on GitHub at https://github.com/ricohr/ricoh-r-console .


License
-------

This software is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
