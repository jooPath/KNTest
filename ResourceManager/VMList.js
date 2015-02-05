/**
 * Created by 짱경노 on 2015-02-04.
 */
    //singleton Pattern
module.exports = VMList;
var VMList = (function () {
    var instance;

    function createList() {
        var vmList = [];
        return vmList;
    }

    return {
        getList: function () {
            if (!instance) {
                instance = createList();
            }
            return instance;
        }
    };
})();
