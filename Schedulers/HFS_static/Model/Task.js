/**
 * Created by 짱경노 on 2015-01-14.
 */

module.exports = Task;

var _ = require('lodash');

var Config = require('../../../Config/Config.js');   // for test
var cf = new Config;                           // for test

function Task(nodeinfo){ // {name:'T1', nodeid:'1', instanceid:'1', cmd:'11111'}
    this.nodeName = nodeinfo.name;
    this.nodeID = nodeinfo.nodeid;
    this.instanceID = nodeinfo.instanceid;
    this.executionCmd = nodeinfo.cmd;
    this.fragID = null;

    this.inputInterface = [];
    this.outputInterface = [];
    this.status = 'available'; // 'available', 'waiting', 'executing', 'finished'

    this.EST = null;
    this.EFT = null;
    this.LST = null;
    this.LFT = null;

    this.addOutputInterface = function(interfaceinfo){//{id:'1', name:'o1', allowedTypes:[]}
        this.outputInterface.push({id:interfaceinfo.id, name:interfaceinfo.name, allowedTypes:interfaceinfo.allowedTypes, instanceID:this.instanceID, connected:null, connectedInterfaceID:null});
    };

    this.addInputInterface = function(interfaceinfo){//{id:'1', name:'i1', allowedTypes:[]}
        this.inputInterface.push({id:interfaceinfo.id, name:interfaceinfo.name, allowedTypes:interfaceinfo.allowedTypes, instanceID:this.instanceID, connected:null, connectedInterfaceID:null});
    };

    this.link = function(linkinfo){ // {from:'1', to:'1', target:t2}
        var target = linkinfo.target;
        var i = _.findIndex(target.inputInterface, {id: linkinfo.to});
        var o = _.findIndex(this.outputInterface, {id: linkinfo.from});

        this.outputInterface[o].connected = target.instanceID;
        this.outputInterface[o].connectedInterfaceID = linkinfo.to;

        target.inputInterface[i].connected = this.instanceID;
        target.inputInterface[i].connectedInterfaceID = linkinfo.from;
    };

    this.nextConnectedList = function(){
        return _.filter(this.outputInterface, function(value){
            return (value.connected != null);
        })
    };
    this.prevConnectedList = function(){
        return _.filter(this.inputInterface, function(value){
            return (value.connected != null);
        })
    };

    // For Test
    this.getExecutionTime = function(){
        return cf.TestforHFS.executionTime[this.nodeID];
    };
    this.getAverageExecutionTime = function(){
        return cf.TestforHFS.executionTimeAverage[this.nodeID];
    };
    this.getCost = function(){
        return cf.TestforHFS.cost;
    }
}
