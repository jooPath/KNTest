/**
 * Created by 짱경노 on 2015-01-14.
 */

module.exports = Task;

var Node = require ('./Node.js');

function Task(node){
    this.base = node;
    this.EST = 0.0;
    this.LST = 1.0;
    this.EFT = 1.0;
    this.LFT = 2.0;

    this.fragID = 1;
}