/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "com/smod/ux/todolist/model/models",
        "com/smod/ux/todolist/utils/sweetalert"
    ],
    function (UIComponent, models, SwalJS) {
        "use strict";

        return UIComponent.extend("com.smod.ux.todolist.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                
                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                // this.setModel(new sap.ui.model.json.JSONModel({
                //     bLoadedInitially: false
                // }), "appModel");
            }
        });
    }
);