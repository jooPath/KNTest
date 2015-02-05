/**
 * Created by 짱경노 on 2015-01-15.
 */

module.exports = Fragmentation;

var _ = require('lodash');
var Fragment = require('./../Model/Fragment.js');

function Fragmentation(taskList, fragmentationinfo, deadline){ // taskList:[], {headid:h, tailid:t}, deadline:150.0

    this.fragmentList = [];
    this.fragmentID = 0;

    this.do = function(){
        var criticalPath = this.fragmentation(fragmentationinfo); // = new Fragment({fragmentID:(fragmentID++)});
        criticalPath.subDeadline = {S:0, E:deadline};

        //console.log(criticalPath.subFrags[0]);

        this.fragmentList.push(criticalPath);
        for(var i=0;i<this.fragmentList.length;i++){
            console.log(this.fragmentList[i].showme());
        }

    };

    this.fragmentation = function(fragmentationinfo){
        var fragment = new Fragment({fragmentID:(this.fragmentID++)});
        //console.log(this.findIndexbyInstanceID(fragmentationinfo.headid));

        var cursor = taskList[this.findIndexbyInstanceID(fragmentationinfo.headid)];

        fragment.taskList.push(cursor);
        fragment.eet += cursor.getAverageExecutionTime();

        while(cursor.instanceID != fragmentationinfo.tailid)
        {
            var nextList = cursor.nextConnectedList();
            //console.log(nextList);
            if(nextList.length == 1)
            {
                cursor = taskList[this.findIndexbyInstanceID(nextList[0].connected)];
                fragment.taskList.push(cursor);
                fragment.eet += cursor.getAverageExecutionTime();
            }

            else{
                var join = this.joinNode(nextList);
                //console.log(this.findIndexbyInstanceID(join.instanceID));
                var sub_fragments = [];
                for(var i=0;i<nextList.length;i++) {
                    var start = taskList[this.findIndexbyInstanceID(nextList[i].connected)];
                    var sub_fragment = this.fragmentation({headid: start.instanceID, tailid: join.instanceID});
                    sub_fragments.push(sub_fragment);
                }
                var critical = _.max(sub_fragments, function(frag) { return frag.eet; });
                fragment.taskList = _.union(fragment.taskList, critical.taskList); // eet 더하는 부분
                fragment.eet += critical.eet;

                for(var i=0;i<nextList.length;i++) {
                    if(sub_fragments[i].fragID == critical.fragID) continue;
                    sub_fragments[i].taskList = _.difference(sub_fragments[i].taskList, fragment.taskList);
                    sub_fragments[i].recalculateEET();

                    this.fragmentList.push(sub_fragments[i]);
                    fragment.subFrags.push({fragment:sub_fragments[i], from:cursor.instanceID, to:join.instanceID});//join 안됨..
                    /*for(var j=0;j<sub_fragments[i].subFrags.length;j++){
                        fragment.subFrags.push({fragment: sub_fragments[i].subFrags[j], from: cursor.instanceID, to: join.instanceID});
                    }*/
                }

                cursor = join;
            }
        }
        return fragment;
    };

    this.findIndexbyInstanceID = function(instanceID){
        return _.findIndex(taskList, {instanceID:instanceID});
    };

    this.reachable = function(task1, task2){ //
        if(task1.instanceID == task2.instanceID) return true;
        var nextList = task1.nextConnectedList();
        while(nextList.length > 0){
            if(_.findIndex(nextList, {connected: task2.instanceID}) >= 0){
                return true;
            }
            for(var i=0;i<nextList.length;i++){
                var nextTask = taskList[this.findIndexbyInstanceID(nextList[i].connected)];
                if(this.reachable(nextTask, task2) == true){
                    return true;
                }
            }
            return false;
        }
        return false;
    };

    this.joinNode = function(nextList){
        var queue = [];
        queue.push(taskList[this.findIndexbyInstanceID(nextList[0].connected)]);
        while(queue.length > 0) {
            var target = queue.shift();
            //console.log(target.instanceID);
            var count = 0;
            for (var i = 1; i < nextList.length; i++) {
                var tmp = taskList[this.findIndexbyInstanceID(nextList[i].connected)];
                //console.log("tmp"+tmp.instanceID);
                if (this.reachable(tmp, target) == true) {
                    count++;
                }
            }
            if (count == nextList.length - 1)return target;

            var tnext = target.nextConnectedList();
            for (var i = 0; i < tnext.length; i++) {
                queue.push(taskList[this.findIndexbyInstanceID(tnext[i].connected)]);
            }
        }
        return -1;
    };
}