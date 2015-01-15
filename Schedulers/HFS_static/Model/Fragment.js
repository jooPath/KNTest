/**
 * Created by 짱경노 on 2015-01-15.
 */

module.exports = Fragment;
function Fragment(fraginfo){ // {fragmentID:1, }
    this.fragID = fraginfo.fragmentID;
    this.taskList = [];
    this.subFrags = [];
    this.subDeadline = {S:-1.0, E:-1.0};

    this.eet = 0;
}