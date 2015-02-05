/**
 * Created by 짱경노 on 2015-01-24.
 */
module.exports = VirtualMachine;

var _ = require('lodash');

function VirtualMachine(VMInformation) { // id, type
    this.vmID = VMInformation.id;
    this.vmType = VMInformation.type;

    this.vmBuildTime = 0;
    this.vmRunningTime = 0;

    this.taskqueue = [];

    this.build = function(){
        this.vmBuildTime = Math.floor(new Date().getTime() / 1000);

        var millisecondsToWait = 5000;

        console.log(this.vmBuildTime);
    };
}