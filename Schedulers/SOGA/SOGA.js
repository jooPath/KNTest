/**
 * Created by 짱경노 on 2015-03-04.
 */

module.exports = SOGA;

var _ = require('lodash');
var Task = require('./Task.js');

function SOGA(taskList, deadline) { // taskList:[], {headid:h, tailid:t}, deadline:150.0
    var generation = 100;   // 세대수
    var popNumber = 100;    // 세대당 인구수
    var crossover_prob = 0.5;   // crossover 확률
    var mutation_prob = 0.05;   // mutation 확률

    this.do = function(){

        var population;
        var next_population;

        this.vm_init(3,3,3);

        for(var i=0;i<generation;i++){

        }
    };
    this.generate_initial_population = function(){

    };
    this.fitness = function(omega1){  // fitness function값
        var omega2 = 1 - omega1;
    };
    this.selection = function(){    // roulette wheel

    };
    this.crossover = function(){    // Cut and splice

    };
    this.mutation = function(){     // Mutation

    };
    this.vm_init = function(small, medium, large){

    }
}