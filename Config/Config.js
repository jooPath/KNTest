/**
 * Created by 짱경노 on 2015-01-13.
 */
module.exports = Config;

var Node = require ('../ResourceManager/Node.js');
var Interface = require ('../ResourceManager/Interface.js'); // test용
function Config(){
    this.ARRAYMAXSIZE = 10;
    this.CloudInfo =
    {
        address: '143.248.152.13',
        port: 5000,
        userID: 'admin',
        passwd: 'ancl2014',

        toString: function(){
            return "Address: "+ this.address + ", User: " + this.userID + ", Passwd: " + this.passwd;
        }
    };
    this.DBInfo =
    {
        address: "mysql://143.248.152.16/workflowrepository",
        userID: 'root',
        passwd: '#ANCL2014kaist',

        toString: function(){
            return "DB Address: "+ this.address + ", User: " + this.userID + ", Passwd: " + this.passwd;
        }
    };
    this.VMInfo = {
        OVM_UNIT_TIME: 60000,
        RVM_UNIT_TIME: 60000
    };

    this.TestforHFS = {
        cost: [0.03, 0.06, 0.12, 0.24], // Tiny, small, medium, large
        executionTime:
            [
                [0.0, 0.0, 0.0],        // Tiny (dummy)
                [0.0, 21.38, 26.33],    // Small
                [0.0, 13.07, 16.73],    // Medium
                [0.0, 8.86, 11.79]      // Large
            ],
        executionTimeAverage: [0.0, 14.43, 18.28],
        testNode: [],

        nodeInit: function(){ // 1->2->3->5 , 1->4->5
            var t1 = new Node(1,1,'1');
            var t2 = new Node(1,2,'2');
            var t3 = new Node(1,3,'3');
            var t4 = new Node(2,4,'4');
            var t5 = new Node(2,5,'5');

            this.testNode.push(t1);
            this.testNode.push(t2);
            this.testNode.push(t3);
            this.testNode.push(t4);
            this.testNode.push(t5);

            var o11 = new Interface('output', t1, 1);

            var o12 = new Interface('output', t1, 2);
            t1.outputInterface.push({type: 'output'});
            t1.outputInterface[0].nextLink = t2.inputInterface[1];
            t1.outputInterface.push(o12);

            var i21 = new Interface('input', t2, 1);
            var o21 = new Interface('output', t2, 1);
            t2.inputInterface.push(i21);
            t2.outputInterface.push(o21);

            var i31 = new Interface('input', t3, 1);
            var o31 = new Interface('output', t3, 1);
            t3.inputInterface.push(i31);
            t3.outputInterface.push(o31);

            var i41 = new Interface('input', t4, 1);
            var o41 = new Interface('output', t4, 1);
            t4.inputInterface.push(i41);
            t4.outputInterface.push(o41);

            var i51 = new Interface('input', t5, 1);
            var i52 = new Interface('output', t5, 1);
            t5.inputInterface.push(i51);
            t5.inputInterface.push(i52);


/*
            t1.makeLink( t1.getInterface('output', 1) , t2.getInterface('input', 1));
            t1.makeLink( t1.getInterface('output', 2) , t4.getInterface('input', 1));

            t2.makeLink( t2.getInterface('output', 1), t3.getInterface('input', 1));
            t3.makeLink( t3.getInterface('output', 1), t5.getInterface('input', 1));

            t4.makeLink( t4.getInterface('output', 1), t5.getInterface('input', 2));*/
        }
    };
}
//var c = new Config();
//console.log(c.DBInfo.toString());