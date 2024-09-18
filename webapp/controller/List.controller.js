sap.ui.define([
    "com/smod/ux/todolist/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    function (BaseController, JSONModel, Filter, FilterOperator) {
        "use strict";

        return BaseController.extend("com.smod.ux.todolist.controller.List", {
            onInit: function () {
                const oViewModel = new JSONModel({
                    queryString: "",
                    busy: false,
                    visible: false
                });

                this.setModel(oViewModel, "listViewModel");
            },
            onBeforeRendering: function () {

            },
            onAfterRendering: function () {

            },
            onExit: function () {

            },
            /** Event handlers */
            onRefreshList: function (oEvent) {

                this.byId("idProjectList").getBinding("items").refresh();

            },
            onSearchProject: function (oEvent) {

                const oViewModel = this.getModel("listViewModel");
                const sQuery = oViewModel.getProperty("/queryString");

                this.byId("idProjectList").getBinding("items").filter(
                    new Filter({
                        path: 'ProjectDescription',
                        operator: FilterOperator.EQ,
                        value1: sQuery
                    })
                );


            },
            onNavToDetailPage: function (oEvent) {
                const sProjectId = oEvent.getSource().getBindingContext().getObject().ProjectId;

                this.getRouter().navTo("Detail", {
                    ProjectId: sProjectId
                });

            }
            /** Event handlers */
        });
    });
