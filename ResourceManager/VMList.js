/**
 * Created by 짱경노 on 2015-02-04.
 */
    //singleton Pattern

module.exports = VMList;

var VMList = (function () {
    var instance;

    function createList() {
        this.vmList = [];
    }

    return {
        getList: function () {
            if (instance == undefined) {
                instance = new createList();
            }
            return instance;
        }
    };
})();