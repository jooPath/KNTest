/**
 * Created by 짱경노 on 2015-02-06.
 */

module.exports = ICPCP;

var _ = require('lodash');
var VMList = require('../../ResourceManager/VMList.js' ) ;
var VirtualMachine = require('../../ResourceManager/VirtualMachine.js');
var Task = require('./Task.js');


function ICPCP(taskList, deadline) { // taskList:[], {headid:h, tailid:t}, deadline:150.0

    var TT = 0.0;
    var id = 1;
    //VMList = require('./../../ResourceManager/VMList.js');
    console.log(VMList);
    var List = VMList.vmList;

    this.do = function(){

       while(taskList.length > 0)
       {
            this.initialization(taskList);
            this.PCP(taskList);
        }/*
        for(var i=0;i<List.length;i++){
            console.log(List[i].test());
        }*/
    };
    this.initialization = function(taskList){
        this.dummyNode(taskList);

        var head = taskList[this.findIndexbyInstanceID('-1')];
        var tail = taskList[this.findIndexbyInstanceID('-2')];

        this.refresh(head, 'E');
        this.refresh(tail, 'L');
    };
    this.PCP = function(taskList){
        var pcp = [];
        cursor = taskList[this.findIndexbyInstanceID('-2')]; // start from tail node

        while (cursor.prevConnectedList().length > 0){
            pcp.push(cursor);
            cursor = this.criticalParent(cursor);
        }
        pcp.push(cursor);


        this.scheduling(pcp);
    };
    this.scheduling = function(pcp){
        var type;
        //console.log(pcp[pcp.length-2].EST+' to '+pcp[1].LFT);
        var deadline = pcp[1].LFT - pcp[pcp.length-2].EST;

        //console.log(deadline);
        for(type = 1;type<=3;type++){
            var sum = Number(pcp[pcp.length-2].EST); // 문제있음
            //sum = sum.toFixed(2); // 여기서 tofixed를 쓰면 에러가 나는 문제가 있는디 까닭은 몰겠음

            for(var i = pcp.length-2; i>=1; i--) { // ignore dummy head/tail
                pcp[i].AST = Number(sum).toFixed(2);
                sum += pcp[i].getExecutionTime(type);
                pcp[i].AFT = Number(sum).toFixed(2);
            }
            if(sum -  Number(pcp[pcp.length-2].EST) < deadline)break;//return type;
        }
        /// type 정하기
        for (var i = pcp.length-2; i>= 1; i--) {
            var successors = pcp[i].nextConnectedList();

            for (var j = 0; j < successors.length; j++) {
                var nextTask = taskList[this.findIndexbyInstanceID(successors[j].connected)];
                if (nextTask.instanceID == pcp[i - 1].instanceID) continue;

                nextTask.EST = Math.max(pcp[i].AFT + TT, nextTask.EST);
                nextTask.EFT = nextTask.EST + nextTask.getExecutionTime(3);

                nextTask.EST = nextTask.EST.toFixed(2);
                nextTask.EFT = nextTask.EFT.toFixed(2);

                this.refresh(nextTask, 'E', pcp);
            }
        }
        for (var i = 1; i< pcp.length-1; i++) {
            var predecessors = pcp[i].prevConnectedList();
            for(var j = 0;j<predecessors.length;j++){
                var prevTask = taskList[this.findIndexbyInstanceID( predecessors[j].connected )];
                if(prevTask.instanceID == pcp[i+1].instanceID) continue;

                prevTask.LFT = Math.min(pcp[i].AST - TT, prevTask.LFT);
                prevTask.LST = prevTask.LFT - prevTask.getExecutionTime(3);

                prevTask.LFT = prevTask.LFT.toFixed(2);
                prevTask.LST = prevTask.LST.toFixed(2);

                this.refresh(prevTask, 'L', pcp);
            }
        }

        if(type == 4){ // type 이내로 스케줄링 불가능하면
            type = 3;   // 가장 좋은 type으로..
        }

        //거꾸로 들어있기 떄문에 순서 뒤집고, 맨앞 맨뒤 task 제거해서 VM에 넣는다.
        var tasks = [];
        for(var i = pcp.length-2;i>=1;i--){
            tasks.push(pcp[i]);
        }

        for(var i = pcp.length -1;i>=0;i--) {
            var index = this.findIndexbyInstanceID( pcp[i].instanceID );
            var successors = pcp[i].nextConnectedList();
            var predecessors = pcp[i].prevConnectedList();
            for(var j = 0;j<successors.length;j++){
                var nextTask = taskList[this.findIndexbyInstanceID( successors[j].connected )];
                pcp[i].removelink(nextTask, 'next');
            }for(var j = 0;j<predecessors.length;j++){
                var prevTask = taskList[this.findIndexbyInstanceID( predecessors[j].connected )];
                pcp[i].removelink(prevTask, 'prev');
            }
            taskList.splice(index, 1);
        }

        var VM = new VirtualMachine({id:id++, type:type, buildtime:tasks[0].AST, terminatetime:tasks[tasks.length-1].AFT});
        VM.taskqueue = tasks;
        List. push(VM);
    };
    this.findIndexbyInstanceID = function(instanceID){
        return _.findIndex(taskList, {instanceID:instanceID});
    };
    this.dummyNode = function(taskList){
        var head = new Task({name:'dummyhead', nodeid:'0', instanceid:'-1', cmd:'-1'});
        var tail = new Task({name:'dummytail', nodeid:'0', instanceid:'-2', cmd:'-2'});

        var headnodes = [];
        var tailnodes = [];

        for(var i=0;i<taskList.length;i++){
            if(taskList[i].prevConnectedList().length == 0)headnodes.push(taskList[i]);
            if(taskList[i].nextConnectedList().length == 0)tailnodes.push(taskList[i]);
        }

        for(var i=0;i<headnodes.length;i++){
            head.addOutputInterface({id: -(i+1)+'', name:'dummy'+(i+1) , allowedTypes:[]});
            headnodes[i].addInputInterface({id: '-1', name:'dummy1', allowedTypes:[]});

            if(headnodes[i].EST != null && headnodes[i].EST <= head.EST){
                head.EST = headnodes[i].EST; // headnodes 의 EST 중 최소값을 넣는다
            }

            head.link({from:-(i+1)+'', to:'-1', target:headnodes[i]});
        }

        for(var i=0;i<tailnodes.length;i++){
            tail.addInputInterface({id: -(i+1)+'', name:'dummy'+(i+1) , allowedTypes:[]});
            tailnodes[i].addOutputInterface({id: '-1', name:'dummy1', allowedTypes:[]});

            if(tailnodes[i].LFT != null && tailnodes[i].LFT >= tail.LFT){
                tail.LFT = tailnodes[i].LFT; // tailnodes 의 LFT 중 최대값을 넣는다
            }
            tailnodes[i].link({from:'-1', to:-(i+1)+'', target:tail});
        }
        taskList.push(head);
        taskList.push(tail);
    };
    this.criticalParent = function(node){
        var prevList = node.prevConnectedList();
        var max = -10000;
        var cp = null;

        for(var i=0;i<prevList.length;i++){
            var pnode = taskList[this.findIndexbyInstanceID(prevList[i].connected)];
            if(Number(pnode.EFT + TT) > max){
                max = Number(pnode.EFT + TT);
                cp = pnode;
            }
        }
        return cp;
    };
    this.refresh = function(task, type, pcp)//this.refresh(nextTask, pcp, 'E' or 'L');
    {
        var queue = [];
        queue.push(task);
        if(pcp == undefined){
            if(type == 'E'){
                task.EFT = 0.0;
                task.EST = 0.0;
            }else{
                task.LFT = deadline;
                task.LST = deadline;
            }
        }
        /// Set EST, EFT
        if(type == 'E') {
            while (queue.length > 0) {
                var value = queue.shift();
                var next = value.nextConnectedList();

                for (var i = 0; i < next.length; i++) {
                    var nextTask = taskList[this.findIndexbyInstanceID(next[i].connected)];
                    if(pcp != undefined && _.findIndex(pcp, function(chr){  // PCP에 존재하는 인자가 나오면 Pass
                            return (chr.instanceID == nextTask.instanceID);
                        }) != -1)continue;
                    nextTask.EST = Math.max(value.EFT + TT, nextTask.EST);
                    nextTask.EFT = Math.max(nextTask.EST + nextTask.getExecutionTime(3), nextTask.EFT);//3: Large type

                    nextTask.EST = nextTask.EST.toFixed(2);
                    nextTask.EFT = nextTask.EFT.toFixed(2);
                    queue.push(nextTask);
                }
            }
        }else{  // set LFT, LST
            while(queue.length > 0){
                var value = queue.shift();
                var prev = value.prevConnectedList();

                for(var i=0;i<prev.length;i++){
                    var prevTask = taskList[this.findIndexbyInstanceID( prev[i].connected )];

                    if(pcp != undefined && _.findIndex(pcp, function(chr){  // PCP에 존재하는 인자가 나오면 Pass
                            return (chr.instanceID == prevTask.instanceID);
                        }) != -1)continue;

                    if(prevTask.LFT == null){ prevTask.LFT = value.LST - TT; }
                    else    {
                        prevTask.LFT = Math.min(value.LST - TT, prevTask.LFT); }
                    if(prevTask.LST == null){prevTask.LST = prevTask.LFT - prevTask.getExecutionTime(3);}
                    else {     prevTask.LST = Math.min(prevTask.LFT - prevTask.getExecutionTime(3), prevTask.LST); }//3: Large type

                    prevTask.LFT = prevTask.LFT.toFixed(2);
                    prevTask.LST = prevTask.LST.toFixed(2);
                    queue.push( prevTask );
                }
            }
        }
    };
}
