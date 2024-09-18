sap.ui.define([], 
function () {
    "use strict";
    return {
        getTodoItemState: function(sItemStatus){
            switch(sItemStatus){
                case "NS":
                    return sap.ui.core.ValueState.Error;
                case "IP":
                    return sap.ui.core.ValueState.Information;
                case "CM":
                    return sap.ui.core.ValueState.Success;
                default:
                    return sap.ui.core.ValueState.Warning;
            }
        }
    };

});