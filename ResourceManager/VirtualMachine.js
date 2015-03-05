/**
 * Created by 짱경노 on 2015-01-24.
 */
module.exports = VirtualMachine;

var _ = require('lodash');

function VirtualMachine(VMInformation) { // id, type, buildtime, terminatetime
    this.vmID = VMInformation.id;
    this.vmType = VMInformation.type;

    this.vmBuildTime = VMInformation.buildtime;
    this.vmTerminateTime = VMInformation.terminatetime;

    //this.vmRunningTime = 0;

    this.taskqueue = [];

    this.build = function(){
        //this.vmBuildTime = Math.floor(new Date().getTime() / 1000);

        //var millisecondsToWait = 5000;

        console.log(this.vmBuildTime);
    };

    this.test = function(){
        var tmp = this.vmID;

        if(this.vmType == 1)tmp += ' (small) => ';
        else if(this.vmType == 2)tmp += ' (medium) => ';
        else tmp += ' (large) => ';

        tmp += this.vmBuildTime + ' : ' + this.vmTerminateTime + '\n\t[';

        for(var i = 0; i< this.taskqueue.length;i++){
            tmp += this.taskqueue[i].instanceID + ' ';
        }
        tmp += ']';
        return tmp;
    }
}