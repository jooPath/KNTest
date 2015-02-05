/**
 * Created by 짱경노 on 2015-01-14.
 */

var Config = require ('../Config/Config.js');
//// HFS_Static!
var Task = require ('../Schedulers/HFS/Model/Task.js');
var Fragmentation = require('../Schedulers/HFS//Management/Fragmentation.js');
var VirtualMachine = require('../ResourceManager/VirtualMachine.js');
var HFS_Static = require('../Schedulers/HFS/Management/HFS_Static.js');
var VMList = require('../ResourceManager/VMList.js');

var cf = new Config;

cf.TestforHFS.testnodeInit2();

var taskList = cf.TestforHFS.testNode;
//for(var i=0;i<taskList.length;i++){
//console.log(i+1 + "\n"+JSON.stringify(taskList[i].inputInterface)+ '\n' + JSON.stringify(taskList[i].outputInterface)+'\n');
//}

//var VM = new VirtualMachine({id:1, type:'m1.small'}).build();
var Frag = new Fragmentation(taskList, {headid:taskList[0].instanceID, tailid:11}, 90.0);
Frag.do();

///new HFS_Static(Frag.fragmentList).do();

//var List = VMList.getList();
//console.log(List)
