/**
 * Created by 짱경노 on 2015-01-15.
 */

module.exports = Fragmentation;

var _ = require('lodash');
var Fragment = require('./../Model/Fragment.js');
var Task = require ('./../Model/Task.js');

function Fragmentation(taskList, deadline){ // taskList:[], {headid:h, tailid:t}, deadline:150.0

    this.fragmentList = [];
    this.fragmentID = 0;

    this.do = function(){
        this.dummyNode(taskList);   // dummy head와 tail 추가. id는 -1, -2 부여.
        var criticalPath = this.fragmentation({headid:'-1', tailid:'-2'});//fragmentationinfo); // = new Fragment({fragmentID:(fragmentID++)});
        criticalPath.subDeadline = {S:0, E:deadline};   // 최종 critical path에 서브데드라인 할당

        //console.log(criticalPath.subFrags[0]);

        this.fragmentList.push(criticalPath);           // 최종 critical path도 fragment list에 합쳐넣는다.
        for(var i=0;i<this.fragmentList.length;i++){
            console.log(this.fragmentList[i].showme());
        }
    };

    this.fragmentation = function(fragmentationinfo){
        var fragment = new Fragment({fragmentID:(this.fragmentID++)});
        //console.log(this.findIndexbyInstanceID(fragmentationinfo.headid));

        var cursor = taskList[this.findIndexbyInstanceID(fragmentationinfo.headid)];      // head에서 시작

        fragment.taskList.push(cursor);                                                    //Critical Path에 head 추가
        fragment.eet += cursor.getAverageExecutionTime(); // Critical Path에서의 예상 소요 시간에 head의 소요시간 추가

        while(cursor.instanceID != fragmentationinfo.tailid) {      // cursor가 tail에 위치할 때까지 loop
            var nextList = cursor.nextConnectedList();              // cursor의 다음 연결된 노드 정보
            //console.log(nextList);
            if(nextList.length == 1)                                // 다음 연결된 노드가 한개 뿐이면
            {
                cursor = taskList[this.findIndexbyInstanceID(nextList[0].connected)];// cursor = 다음 노드
                fragment.taskList.push(cursor);                                       // 다음 노드 Critical Path에 추가
                fragment.eet += cursor.getAverageExecutionTime();                     // 다음 노드의 소요시간 추가
            }

            else{                                                   // cursor가 다수의 노드와 연결되어 있으면
                var join = this.joinNode(nextList);                 // join = 연결된 다음 노드들이 최초로 만나는 지점
                //console.log(this.findIndexbyInstanceID(join.instanceID));
                var sub_fragments = [];
                for(var i=0;i<nextList.length;i++) {
                    var start = taskList[this.findIndexbyInstanceID(nextList[i].connected)];// 각각의 다음 노드에 대해
                    var sub_fragment = this.fragmentation({headid: start.instanceID, tailid: join.instanceID});
                    // start 부터 join 까지의 critical path 계산.
                    sub_fragments.push(sub_fragment); // 계산된 critical path를 일단 sub_fragments 배열에 넣는다
                }
                var critical = _.max(sub_fragments, function(frag) { return frag.eet; });// eet가 최대인 fragment를
                fragment.taskList = _.union(fragment.taskList, critical.taskList); // 현재 critical path의 task에 합침
                fragment.eet += critical.eet;   // 해당 fragment의 eet도 현재 critical path에 합침

                for(var i=0;i<nextList.length;i++) {
                    if(sub_fragments[i].fragID == critical.fragID) continue;
                    sub_fragments[i].taskList = _.difference(sub_fragments[i].taskList, fragment.taskList);
                    // 다른 sub_fragment에서는 critical path에 합쳐진 tasklist를 제외한다 (겹치는경우 있으므로)
                    sub_fragments[i].recalculateEET(); // 제외된 task에 대해 eet 다시 계산

                    var flag = true;
                    for(var j=0;j<this.fragmentList.length;j++){
                        if(_.isEqual(this.fragmentList[j].taskList, sub_fragments[i].taskList)) flag = false;
                    }// fragmentList에 sub_fragment 있는지 중복체크
                    if(flag){
                        this.fragmentList.push(sub_fragments[i]); // 중복 없으면 넣는다 (중복되는 경우가 있음..)
                        for(var j=0;j<sub_fragments[i].subFrags.length;j++){
                            fragment.subFrags.push(sub_fragments[i].subFrags[j]); // sub_fragment의 subFrags도 넣어준다.
                        }
                    }
                    fragment.subFrags.push({fragment:sub_fragments[i], from:cursor.instanceID, to: this.subFragmentNextNodeID(fragment.taskList, sub_fragments[i].taskList[sub_fragments[i].taskList.length-1])});
                    // 현재 fragment에 taskList에 합쳐지지 않은 subfragment들을 합쳐넣는다.

                    sub_fragments[i].subFrags = []; // 합쳐진 sub_fragment들의 subfragment를 초기화시킨다
                }

                cursor = join; // join 까지 계산 완료되었으므로 join 다음노드부터 살핀다
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

    this.subFragmentNextNodeID = function(taskList, lastnode){
        var nextList = lastnode.nextConnectedList();
        for (var i=0;i<nextList.length;i++){
            var index = _.findIndex(taskList, function(task){return task.instanceID == nextList[i].connected});
            if( index >= 0)return taskList[index].instanceID;
        }
        return -1;
    };

    this.dummyNode = function(taskList){
        var head = new Task({name:'dummyhead', nodeid:'0', instanceid:'-1', cmd:'-1'});
        var tail = new Task({name:'dummytail', nodeid:'0', instanceid:'-2', cmd:'-2'});

        var headnodes = [];
        var tailnodes = [];

        ///{id:interfaceinfo.id, name:interfaceinfo.name, allowedTypes:interfaceinfo.allowedTypes, instanceID:this.instanceID, connected:null, connectedInterfaceID:null}
        for(var i=0;i<taskList.length;i++){
            if(taskList[i].prevConnectedList().length == 0)headnodes.push(taskList[i]);
            if(taskList[i].nextConnectedList().length == 0)tailnodes.push(taskList[i]);
        }

        //t2.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
        //t2.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
        for(var i=0;i<headnodes.length;i++){
            head.addOutputInterface({id: -(i+1)+'', name:'dummy'+(i+1) , allowedTypes:[]});
            headnodes[i].addInputInterface({id: '-1', name:'dummy1', allowedTypes:[]});

            head.link({from:-(i+1)+'', to:'-1', target:headnodes[i]});
        }
        for(var i=0;i<tailnodes.length;i++){
            tail.addInputInterface({id: -(i+1)+'', name:'dummy'+(i+1) , allowedTypes:[]});
            tailnodes[i].addOutputInterface({id: '-1', name:'dummy1', allowedTypes:[]});

            tailnodes[i].link({from:'-1', to:-(i+1)+'', target:tail});
        }
        //console.log(head.outputInterface);
        //console.log(tail.inputInterface);
        taskList.push(head);
        taskList.push(tail);
    }
}