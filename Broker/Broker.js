/**
 * Created by 짱경노 on 2015-01-14.
 */

var Config = require ('../Config/Config.js');
var cf = new Config;
cf.TestforHFS.nodeInit();
console.log(JSON.stringify(cf.TestforHFS.testNode[0]));
console.log(JSON.stringify(cf.TestforHFS.testNode[1]));
console.log(JSON.stringify(cf.TestforHFS.testNode[2]));
console.log(JSON.stringify(cf.TestforHFS.testNode[3]));
console.log(JSON.stringify(cf.TestforHFS.testNode[4]));
