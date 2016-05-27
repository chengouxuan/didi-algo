'use strict';
var AV = require('leanengine');

AV.init({
  appId: 'Qy19bOwn1SMDMPMg3SYzCBQv-gzGzoHsz',
  appKey: '4SSMP0orn9lv7HRiN6LGVN8A',
  masterKey: 'LWCgTKK5r9PFSfITb2UDWEzG'
});

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

module.exports = AV;
