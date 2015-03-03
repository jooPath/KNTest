/**
 * Created by 짱경노 on 2015-01-13.
 */
module.exports = Config;

//var Task = require ('../Schedulers/HFS/Model/Task.js');
var Task = require ('../Schedulers/ICPCP/Task.js');
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
                [0.0, 0.0, 0.0, 0.0],       // dummy
                [0.0, 21.38, 13.07, 8.86],  // sdf-100
                [0.0, 26.33, 16.73, 11.79]  // sdf-200
            ],
        executionTimeAverage: [0.0, 14.43, 18.28],
        testNode: [],

        testnodeInit: function(){ // 1->2->3->5 , 1->4->5
            var t1 = new Task({name:'T1', nodeid:'1', instanceid:'1', cmd:'111'});
            var t2 = new Task({name:'T2', nodeid:'1', instanceid:'2', cmd:'222'});
            var t3 = new Task({name:'T3', nodeid:'1', instanceid:'3', cmd:'333'});
            var t4 = new Task({name:'T4', nodeid:'2', instanceid:'4', cmd:'444'});
            var t5 = new Task({name:'T5', nodeid:'2', instanceid:'5', cmd:'555'});

            this.testNode.push(t1);
            this.testNode.push(t2);
            this.testNode.push(t3);
            this.testNode.push(t4);
            this.testNode.push(t5);

            t1.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t1.addOutputInterface({id:'2', name:'o2', allowedTypes:[]});
            t1.addOutputInterface({id:'3', name:'o3', allowedTypes:['test']});

            t2.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t2.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});

            t3.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t3.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});

            t4.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t4.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});

            t5.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t5.addInputInterface({id:'2', name:'i2', allowedTypes:[]});

            t1.link({from:'1', to:'1', target:t2});
            t1.link({from:'2', to:'1', target:t4});
            t2.link({from:'1', to:'1', target:t3});
            t3.link({from:'1', to:'1', target:t5});
            t4.link({from:'1', to:'2', target:t5});
        },
        testnodeInit2: function() { // 1->2->3->5 , 1->4->5
            //var Task = require ('../Schedulers/HFS/Model/Task.js');
            var t1 = new Task({name:'T1', nodeid:'1', instanceid:'1', cmd:'111'});
            var t2 = new Task({name:'T2', nodeid:'1', instanceid:'2', cmd:'222'});
            var t3 = new Task({name:'T3', nodeid:'1', instanceid:'3', cmd:'333'});
            var t4 = new Task({name:'T4', nodeid:'2', instanceid:'4', cmd:'444'});
            var t5 = new Task({name:'T5', nodeid:'1', instanceid:'5', cmd:'555'});
            var t6 = new Task({name:'T6', nodeid:'2', instanceid:'6', cmd:'555'});
            var t7 = new Task({name:'T7', nodeid:'1', instanceid:'7', cmd:'555'});
            var t8 = new Task({name:'T8', nodeid:'2', instanceid:'8', cmd:'555'});
            var t9 = new Task({name:'T9', nodeid:'2', instanceid:'9', cmd:'555'});
            var t10 = new Task({name:'T10', nodeid:'1', instanceid:'10', cmd:'555'});
            var t11 = new Task({name:'T11', nodeid:'1', instanceid:'11', cmd:'555'});
            var t12 = new Task({name:'T12', nodeid:'1', instanceid:'12', cmd:'555'});
            var t13 = new Task({name:'T13', nodeid:'1', instanceid:'13', cmd:'555'});
            var t14 = new Task({name:'T14', nodeid:'2', instanceid:'14', cmd:'555'});
            var t15 = new Task({name:'T15', nodeid:'2', instanceid:'15', cmd:'555'});
            var t16 = new Task({name:'T16', nodeid:'2', instanceid:'16', cmd:'555'});
            var t17 = new Task({name:'T17', nodeid:'1', instanceid:'17', cmd:'555'});

            this.testNode.push(t1);
            this.testNode.push(t2);
            this.testNode.push(t3);
            this.testNode.push(t4);
            this.testNode.push(t5);
            this.testNode.push(t6);
            this.testNode.push(t7);
            this.testNode.push(t8);
            this.testNode.push(t9);
            this.testNode.push(t10);
            this.testNode.push(t11);
            this.testNode.push(t12);
            this.testNode.push(t13);
            this.testNode.push(t14);
            this.testNode.push(t15);
            this.testNode.push(t16);
            this.testNode.push(t17);

            t1.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});

            t2.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t2.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t2.addOutputInterface({id:'2', name:'o2', allowedTypes:[]});
            t2.addOutputInterface({id:'3', name:'o3', allowedTypes:[]});

            t3.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t3.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t4.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t4.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t12.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t12.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t13.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t13.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t14.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t14.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t15.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t15.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});

            t5.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t5.addInputInterface({id:'2', name:'i2', allowedTypes:[]});
            t5.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t5.addOutputInterface({id:'2', name:'o2', allowedTypes:[]});

            t6.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t6.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t7.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t7.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t16.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t16.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});

            t8.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t8.addInputInterface({id:'2', name:'i2', allowedTypes:[]});
            t8.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t8.addOutputInterface({id:'2', name:'o2', allowedTypes:[]});

            t17.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t17.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});
            t9.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t9.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});

            t10.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t10.addInputInterface({id:'2', name:'i2', allowedTypes:[]});
            t10.addOutputInterface({id:'1', name:'o1', allowedTypes:[]});

            t11.addInputInterface({id:'1', name:'i1', allowedTypes:[]});
            t11.addInputInterface({id:'2', name:'i2', allowedTypes:[]});

            t1.link({from:'1', to:'1', target:t2});

            t2.link({from:'1', to:'1', target:t3});
            t2.link({from:'2', to:'1', target:t12});
            t2.link({from:'3', to:'1', target:t14});

            t3.link({from:'1', to:'1', target:t4});
            t12.link({from:'1', to:'1', target:t13});

            t4.link({from:'1', to:'1', target:t5});
            t13.link({from:'1', to:'2', target:t5});

            t14.link({from:'1', to:'1', target:t15});
            t15.link({from:'1', to:'2', target:t11});

            t5.link({from:'1', to:'1', target:t6});
            t5.link({from:'2', to:'1', target:t16});

            t6.link({from:'1', to:'1', target:t7});
            t16.link({from:'1', to:'2', target:t8});
            t7.link({from:'1', to:'1', target:t8});

            t8.link({from:'1', to:'1', target:t17});
            t8.link({from:'2', to:'1', target:t9});

            t17.link({from:'1', to:'1', target:t10});
            t9.link({from:'1', to:'2', target:t10});

            t10.link({from:'1', to:'1', target:t11});
        }
    };
}
//var c = new Config();
//console.log(c.DBInfo.toString());