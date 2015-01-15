/**
 * Created by 짱경노 on 2015-01-13.
 */

module.exports = Node;
var _ = require('lodash');
var Config = require ('../Config/Config.js');
var cf = new Config;

function Node(nodeinfo){ // {name:'T1', nodeid:'1', instanceid:'1', cmd:'11111'}
    this.nodeName = nodeinfo.name; // nodename;//"Dummy";
    this.nodeID = nodeinfo.nodeid;// "taskid";
    this.instanceID = nodeinfo.instanceid;// "Module Instance ID";
    this.executionCmd = nodeinfo.cmd;// "Execution Command";

    //this.nextNode = [];
    //this.prevNode = [];

    this.inputInterface = [];
    this.outputInterface = [];
    this.status = 'available'; // 'available', 'waiting', 'executing', 'finished'

    this.addOutputInterface = function(interfaceinfo){
        this.outputInterface.push({id:interfaceinfo.id, name:interfaceinfo.name, allowedTypes:interfaceinfo.allowedTypes, instanceID:this.nodeID, connected:null, connectedInterfaceID:null});
    };//{id:'1', name:'o1', allowedTypes:[]})

    this.addInputInterface = function(interfaceinfo){
        this.inputInterface.push({id:interfaceinfo.id, name:interfaceinfo.name, allowedTypes:interfaceinfo.allowedTypes, instanceID:this.nodeID, connected:null, connectedInterfaceID:null});
    };//{id:'1', name:'i1', allowedTypes:[]})

    this.link = function(linkinfo){
        var target = linkinfo.target;
        var i = _.findIndex(target.inputInterface, {id: linkinfo.to});
        var o = _.findIndex(this.outputInterface, {id: linkinfo.from});

        this.outputInterface[o].connected = target.nodeID;
        this.outputInterface[o].connectedInterfaceID = linkinfo.to;

        target.inputInterface[i].connected = this.nodeID;
        target.inputInterface[i].connectedInterfaceID = linkinfo.from;
    }; // {from:'1', to:'1', target:t2}

    this.execute = function(){
        if(this.status === 'available'){
            return true;
        }
        return false;
    };
}