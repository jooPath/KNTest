/**
 * Created by 짱경노 on 2015-01-13.
 */
module.exports = Config;

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

        nodeInit: function(){ // 1->2->3->5 , 1->4->5
            var Task = require ('../Schedulers/HFS_static/Model/Task.js');
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
        }
    };
}
//var c = new Config();
//console.log(c.DBInfo.toString());