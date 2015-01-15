/**
 * Created by 짱경노 on 2015-01-15.
 */

module.exports = Fragmentation;

var _ = require('lodash');
var Fragment = require('./../Model/Fragment.js');

function Fragmentation(fragmentationinfo, deadline){ // {taskList:[], headid:h, tailid:t, deadline:150.0}
    this.fragmentList = [];
    this.fragmentID = 0;

    //console.log(fragmentationinfo);
    this.do = function(){
        var criticalPath = this.fragmentation(fragmentationinfo); // = new Fragment({fragmentID:(fragmentID++)});
        //criticalPath.subDeadline = {S:0, E:deadline};
    };
    this.fragmentation = function(fragmentationinfo){
        var fragment = new Fragment({fragmentID:(this.fragmentID++)});
        var cursor = fragmentationinfo.taskList[this.findIndexbyInstanceID(fragmentationinfo.h)];

        fragment.taskList.push(cursor);


       // console.log(cursor.outputInterface);
       // console.log(cursor.inputInterface);

        //console.log(nextList);

        while(cursor.instanceID != fragmentationinfo.tailid)
        {
            var nextList = cursor.nextConnectedList();
            if(nextList.length == 1)
            {

                cursor = fragmentationinfo.taskList[this.findIndexbyInstanceID(nextList[0].instanceID)];
            }

            else{

            }
        }
    };
    this.findIndexbyInstanceID = function(instanceID){
        return _.findIndex(fragmentationinfo.taskList, {instanceID:instanceID});
    };
}