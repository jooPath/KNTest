/**
 * Created by 짱경노 on 2015-02-04.
 */
module.exports = HFS_Dynamic;

var _ = require('lodash');
var Fragment = require('./../Model/Fragment.js');
var Config = require('../../../Config/Config.js');
var VirtualMachine = require('../../../ResourceManager/VirtualMachine.js');
var cf = new Config;

function HFS_Dynamic(fragList) { // taskList:[], {headid:h, tailid:t}, deadline:150.0

    this.do = function() {
        var vmType_min = 1, vmType_max = 3; // 나중에 Config로 옮기면 됨....
        var vm_unit = 0;

    };
    this.mandatoryTask = function(fragment, vm_unit){ // vm_unit: 1, 2, 단위 VM 사용
        fragment.recalculateEET();
        // console.log(fragment.eet + "eet");
        var load = fragment.eet * Math.min (((vm_unit * cf.VMInfo.OVM_UNIT_TIME / 1000) / (fragment.subDeadline.E - fragment.subDeadline.S)), 1.0) ;
        var loadsum = 0;

        if(load == fragment.eet){return fragment.taskList[fragment.taskList.length-1];}

        var manTask = fragment.taskList[0];
        //console.log(load + "load");

        for(var i=0;i<fragment.taskList.length;i++){
            loadsum += fragment.taskList[i].getAverageExecutionTime();
            //console.log(i + ':'+loadsum);
            if(loadsum <= load){
                manTask = fragment.taskList[i];
            }else{
                break;
            }
        }
        return manTask;
    };
    this.findIndexbyInstanceID = function(scheduleList, instanceID){

        for(var i=0;i<scheduleList.length;i++){
            for(var j=0;j<scheduleList[i].taskList.length;j++){
                if(scheduleList[i].taskList[j].instanceID == instanceID)return scheduleList[i].taskList[j];
            }
        }
        return -1;
    };
}