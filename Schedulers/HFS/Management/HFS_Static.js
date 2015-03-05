/**
 * Created by 짱경노 on 2015-01-23.
 */

module.exports = HFS_Static;

var _ = require('lodash');
var Config = require('../../../Config/Config.js');
var VirtualMachine = require('../../../ResourceManager/VirtualMachine.js');
var VMList = require('../../../ResourceManager/VMList.js' ) ;
var cf = new Config;

function HFS_Static(fragList) { // taskList:[], {headid:h, tailid:t}, deadline:150.0

    var List = VMList.vmList;
    var id = 1;

    this.do = function() {
        var vmType_min = 1, vmType_max = 3; // 나중에 Config로 옮기면 됨....
        var vm_unit = 0;

        while (fragList.length > 0) {       // 프래그먼트 dequeue
            var type;
            var tasks = [];

            var target = _.find(fragList, function (chr) {
                return chr.availableCheck();
            });
            if(target == undefined)break;   // delete!
            fragList = _.without(fragList, target);

            while(target.taskList.length > 0)   // 프래그먼트 scheduling
            {
                vm_unit++;          // 처음에 VM_Unit = 1 (스케줄링에 실패하면 VM Unit은 기존꺼에 1 더해짐)

                var manTask = this.mandatoryTask(target, vm_unit).instanceID;   // mandatory task
                var manTaskIndex = _.findIndex(target.taskList, function (task) {    // mandatory index
                    return task.instanceID == manTask;
                });

                for (var i = vmType_min; i <= vmType_max; i++) {                   // find VM Type
                    var sum = 0;
                    for (var j = 0; j < target.taskList.length; j++) {
                        if (sum + target.taskList[j].getExecutionTime(i) <= vm_unit * cf.VMInfo.OVM_UNIT_TIME / 1000) {
                            target.taskList[j].EST = Number(sum + target.subDeadline.S).toFixed(2);
                            sum += target.taskList[j].getExecutionTime(i);
                            target.taskList[j].EFT = Number(sum + target.subDeadline.S).toFixed(2);// set EST, EFT of task
                        } else {
                            break;
                        }
                    }
                    if (j >= manTaskIndex) {   // manTask를 포함하는 vm Type을 찾음
                        if (target.deadline() <= vm_unit * cf.VMInfo.OVM_UNIT_TIME / 1000 && sum >= target.deadline() && i != vmType_max)continue;
                        // 남은 데드라인 < VM Unit time인 경우 데드라인보다 큰지도 체크해야함 (vmtype이 최대인경우는 제외)
                        type = i;
                        tasks = _.take(target.taskList, j);

                        var btime = Number(tasks[0].EST);
                        var VM = new VirtualMachine({id:id++, type:type, buildtime:btime.toFixed(2), terminatetime: Number(btime+ vm_unit * cf.VMInfo.OVM_UNIT_TIME / 1000).toFixed(2) });

                        VM.taskqueue = tasks;
                        List.push(VM);
                        //console.log(VM.test());

                        target.taskList = _.drop(target.taskList, j);   // 추가된 부분 제외한 친구들에대해 다시 스케줄링
                        target.subDeadline.S += sum;                    // 데드라인 변경

                        vm_unit = 0; // 스케줄링 성공했으니 다음 loop에 vm_unit을 1로 바꾸기 위해
                        break;
                    }
                }
            }
                // LFT, LST 계산 부분.  sub-deadline을 부득이하게 어기는 경우, LFT가 음수가 나올 수 있기 때문에 전체 노드의 EST와 비교
            var sum = target.subDeadline.E; // 데드라인부터

            for (var i = List.length - 1; i >= 0; i--) {    // ScheduleList의 뒷부분부터
                for (var j = List[i].taskqueue.length - 1; j >= 0; j--) {   // 각 List의 task도 뒷부분부터
                    // 스케줄 실패한 경우에는 LFT=EFT, LST=EST
                    List[i].taskqueue[j].LFT = Math.max(sum, List[i].taskqueue[j].EFT).toFixed(2);
                    sum -= List[i].taskqueue[j].getExecutionTime(type);
                    List[i].taskqueue[j].LST = Math.max(sum, List[i].taskqueue[j].EST).toFixed(2);
                }
            }

            for(var i = 0; i< target.subFrags.length; i++){
                // sub-fragment들의 데드라인 할당
                target.subFrags[i].fragment.subDeadline.S = Number( this.findIndexbyInstanceID(List,  target.subFrags[i].from).EFT );
                target.subFrags[i].fragment.subDeadline.E = Number( this.findIndexbyInstanceID(List,  target.subFrags[i].to).LST );
            }
        };
    };
    this.mandatoryTask = function(fragment, vm_unit){ // vm_unit: 1, 2, 단위 VM 사용
        fragment.recalculateEET();
       // console.log(fragment.eet + "eet");
        var load = fragment.eet * Math.min (((vm_unit * cf.VMInfo.OVM_UNIT_TIME / 1000) / (fragment.subDeadline.E - fragment.subDeadline.S)), 1.0) ;
        var loadsum = 0;

        if(load == fragment.eet){return fragment.taskList[fragment.taskList.length-1];}

        var manTask = fragment.taskList[0];
        //console.log(load + "load");

        for(var i=0;i<fragment.taskList.length;i++){
            loadsum += fragment.taskList[i].getAverageExecutionTime();
            //console.log(i + ':'+loadsum);
            if(loadsum <= load){
                manTask = fragment.taskList[i];
            }else{
                break;
            }
        }
        return manTask;
    };
    this.findIndexbyInstanceID = function(List, instanceID){

        for(var i=0;i<List.length;i++){
            for(var j=0;j<List[i].taskqueue.length;j++){
                if(List[i].taskqueue[j].instanceID == instanceID)return List[i].taskqueue[j];
            }
        }
        return -1;
    };
}