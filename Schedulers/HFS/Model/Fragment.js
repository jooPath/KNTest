/**
 * Created by 짱경노 on 2015-01-15.
 */

var _ = require('lodash'); // for debug

module.exports = Fragment;
function Fragment(fraginfo){ // {fragmentID:1, }
    this.fragID = fraginfo.fragmentID;
    this.taskList = [];
    this.subFrags = [];
    this.subDeadline = {S:-1.0, E:-1.0};

    this.eet = 0;

    this.recalculateEET = function(){
        this.eet = 0;

        for(var i=0;i<this.taskList.length;i++){
            this.eet += this.taskList[i].getAverageExecutionTime();
        }
    };

    this.availableCheck = function(){
        if(this.subDeadline.S >= 0 && this.subDeadline.E > this.subDeadline.S)return true;
        return false;
    };
    this.deadline = function(){
        return (this.subDeadline.E - this.subDeadline.S);
    }

    this.showme = function(){ // for debug
        var res = "";
        res += '[' + _.pluck(this.taskList, 'instanceID') + ']\t EET: '+this.eet + ', SUBFRAGS: ';

        for(var i=0;i<this.subFrags.length;i++){
            res += '[' + _.pluck(this.subFrags[i].fragment.taskList, 'instanceID') + '] (' + this.subFrags[i].from + ':' + this.subFrags[i].to +'), ';
        }
        if(this.subFrags.length == 0){
            res += 'NONE';
        }
        if(this.availableCheck() == true){res += '(available)';}
        return res;
    }
}