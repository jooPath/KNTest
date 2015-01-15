/**
 * Created by 짱경노 on 2015-01-14.
 */

module.exports = Interface;

function Interface (type, instance, interfaceid) {
    this.type = type; //'input'; // input interface or output interface
    this.linked = false;

    //this.instance = instance;//'instane id';
    this.interfaceID = interfaceid;// 1;

    //this.portName = 'abc';
    //this.allowedTypes = ['exe', 'txt', ];

    this.linkedInterface;// = new Interface();

    this.myName = function(){
        return '(' + this.type + 'interface ' + this.instance.instanceID + '_' + this.interfaceID + ')';
    };

    this.toString = function(){
        var res = '(' + this.type + 'interface ' + this.instance.instanceID + '_' + this.interfaceID + ') : Linked to ';

        if(this.linked == true){ res += this.linkedInterface.myName() + '\n'; }
        else {res += 'none\n';}
        return res;
    }
}
/*
Interface.prototype.myName = function () {
    this.myName = function(){
        return '(' + this.type + 'interface ' + this.instance.instanceID + '_' + this.interfaceID + ')';
    };

    this.toString = function(){
        var res = '(' + this.type + 'interface ' + this.instance.instanceID + '_' + this.interfaceID + ') : Linked to ';

        if(this.linked == true){ res += this.linkedInterface.myName() + '\n'; }
        else {res += 'none\n';}
        return res;
    }
}*/