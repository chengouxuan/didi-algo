var AV = require('leanengine');

AV.initialize('Qy19bOwn1SMDMPMg3SYzCBQv-gzGzoHsz', '4SSMP0orn9lv7HRiN6LGVN8A', 'LWCgTKK5r9PFSfITb2UDWEzG');

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

module.exports = AV;
