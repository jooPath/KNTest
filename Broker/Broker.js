/**
 * Created by 짱경노 on 2015-01-14.
 */

var Config = require ('../Config/Config.js');
//// HFS_Static!
var Task = require ('../Schedulers/HFS_static/Model/Task.js');
var Fragmentation = require('../Schedulers/HFS_static/Management/Fragmentation.js');

var cf = new Config;

cf.TestforHFS.nodeInit();

var taskList = cf.TestforHFS.testNode;
//console.log(JSON.stringify(taskList));

new Fragmentation({taskList:taskList, headid:taskList[0].instanceID, tailid:taskList[taskList.length-1].instanceID}, 100.0).do();
