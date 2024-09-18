sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(Controller) {
      "use strict";
  
      return Controller.extend("com.smod.ux.todolist.controller.BaseController", {
        getModel: function(sModel){
            return this.getView().getModel(sModel);
        },
        setModel: function(oModel, sModelName){
            return this.getView().setModel(oModel,sModelName);
        },
        byId: function(sId){
            return this.getView().byId(sId);
        },
        getRouter: function(){
            return this.getOwnerComponent().getRouter();
        },
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
        getText: function(sTextId, aParam = []){
            return this.getResourceBundle().getText(sTextId, aParam);
        }
      });
    }
  );
  