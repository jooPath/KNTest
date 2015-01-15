/**
 * Created by 짱경노 on 2015-01-13.
 */

module.exports = Node;

var Config = require ('../Config/Config.js');
var cf = new Config;

function Node(nodename, nodeid, instanceid, executioncmd){
    this.nodeName = nodename;//"Dummy";
    this.nodeID = nodeid;// "taskid";
    this.instanceID = instanceid;// "Module Instance ID";
    this.executionCmd = executioncmd;// "Execution Command";

    this.nextNode = [];
    this.prevNode = [];

    this.inputInterface = [];
    this.outputInterface = [];
    this.status = 'available'; // 'available', 'waiting', 'executing', 'finished'

    this.getInterface = function(type, id){
        if( type === 'input'){
            for(var i = 0; i < this.inputInterface.length; i++){
                if(this.inputInterface[i].interfaceID == id){
                    return this.inputInterface[i];
                }
            }
        }else{
            for(var i = 0; i < this.outputInterface.length; i++){
                if(this.outputInterface[i].interfaceID == id){
                    return this.outputInterface[i];
                }
            }
        }
        return false;
    };
    this.makeLink = function(interface1, interface2){ // 이 함수를 그런데 Node에서 정의해야 하는가?? (의문)
        if(interface1.linked == true || interface2.linked == true)return false;

        if(interface1.type === 'input'){
            if(interface2.type === 'input')return false; // (instance1) input <-> output (instance2)

            interface1.instance.prevNode.push(interface2.instance);  // add prevNode of instance1
            interface2.instance.nextNode.push(interface1.instance);  // add nextNode of instance2

            interface1.linkedInterface = interface2;        // connect interface each other
            interface2.linkedInterface = interface1;
            interface1.linked = true;
            interface2.linked = true;
        }
        else{
            if(interface2.type === 'output')return false; // (instance1) output <-> input (instance2)

            interface1.instance.nextNode.push(interface2.instance);  // add nextNode of instance1
            interface2.instance.prevNode.push(interface1.instance);  // add prevNode of instance2

            interface1.linkedInterface = interface2;        // connect interface each other
            interface2.linkedInterface = interface1;
            interface1.linked = true;
            interface2.linked = true;
        }

    };

    this.execute = function(){
        if(this.status === 'available'){
            return true;
        }
        return false;
    };

    this.toString = function(){
        var res =  'Node name: ' + this.nodeName + ', id: '+ this.nodeID+ ', instanceid: '+ this.instanceID + '\n';
        res += 'input nodes ===\n';
        for(var i=0;i<this.inputInterface.length;i++){
            res += this.getInterface('input', i).toString();
        }
        res += 'output nodes ==\n';
        //console.log('test', this.outputInterface);
        for(var i=0;i<this.outputInterface.length;i++){
            res += this.getInterface('output', i).toString();
        }
        return res;
    };

}