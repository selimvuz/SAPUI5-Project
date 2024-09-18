sap.ui.define(
  [
    "com/smod/ux/todolist/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/VBox",
    "sap/m/Button",
    "com/smod/ux/todolist/model/formatter",
  ],
  function (
    BaseController,
    Fragment,
    JSONModel,
    MessageToast,
    MessageBox,
    Dialog,
    Text,
    VBox,
    Button,
    formatter
  ) {
    "use strict";

    return BaseController.extend("com.smod.ux.todolist.controller.Detail", {
      formatter: formatter,

      onInit: function () {
        const oViewModel = new JSONModel({
          todoItem: this._initiateTodoItem(),
          todoItemValidation:this._initiateTodoItemValidation()
        });

        this.getView().setModel(oViewModel, "detailViewModel");

        this.getOwnerComponent()
          .getRouter()
          .getRoute("Detail")
          .attachPatternMatched(this.onDetailRouteMatched, this);
      },

      /** Event handlers */
      onNavBack: function () {
        this.getRouter().navTo("List");
      },
      onDetailRouteMatched: async function (oEvent) {
        const sProjectId = oEvent.getParameter("arguments")?.ProjectId || null;
        const oModel = this.getModel();

        if (sProjectId === null) {
          this.onNavBack();
        }
        //--Save prject
        this._sProjectId = sProjectId;

        await oModel.metadataLoaded();
        const sPath = oModel.createKey("/ProjectSet", {
          ProjectId: sProjectId,
        });

        // this.byId("detailPage").bindElement(`/ProjectSet('${sProjectId}')`);
        this.byId("detailPage").bindElement(sPath);
      },
      onAddNewTodo: async function () {
        try {
          if (!this._oAddItemDialog) {
            this._oAddItemDialog = await Fragment.load({
              name: "com.smod.ux.todolist.fragments.NewTodoItem",
              controller: this,
            });
            this.getView().addDependent(this._oAddItemDialog);
          }
          this._resetTodoItem();
          this._oAddItemDialog.open();
        } catch (e) {}
      },
      onAddNewTodoCancelled: function () {
        MessageToast.show("Add new todo is cancelled");
        this._oAddItemDialog.close();
      },

      onSaveNewTodo: function () {
        const oViewModel = this.getModel("detailViewModel");
        const oTodoItem = oViewModel.getProperty("/todoItem");
        const oModel = this.getModel();

        this._resetTodoItemValidation();

        if(oTodoItem.ItemDescription?.trim() === "" || oTodoItem.ItemDescription === null){
            oViewModel.setProperty("/todoItemValidation/ItemDescription/ValueState","Error");
        }
        if(oTodoItem.ItemStatus === null){
            oViewModel.setProperty("/todoItemValidation/ItemStatus/ValueState","Error");
        }
        if(oTodoItem.Username?.trim() === "" || oTodoItem.Username === null){
            oViewModel.setProperty("/todoItemValidation/Username/ValueState","Error");
        }
        if(oTodoItem.Category === null){
            oViewModel.setProperty("/todoItemValidation/Category/ValueState","Error");
        }

        /* Form validation via code */
        // const oForm = sap.ui.getCore().byId("idTodoItemForm");

        // if (!oForm) {
        //   return;
        // }

        // const aFC = oForm.getFormContainers() || [];

        // aFC.forEach((oFC) => {
        //   const aFE = oFC.getAggregation("formElements") || [];
        //   aFE.forEach((oFE) => {
        //     const aFL = oFE.getFields() || [];
        //     aFL.forEach((oField) => {
        //       oField.setValueState("None");
        //       if (typeof oField.getValue === "function") {
        //         if (oField.getValue() === "" || oField.getValue() === null) {
        //           oField.setValueState("Error");
        //           oField.setValueStateText("Zorunlu alan");
        //         }
        //       }else if (typeof oField.getSelectedKey === "function") {
        //         if (
        //           oField.getSelectedKey() === "" ||
        //           oField.getSelectedKey() === null
        //         ) {
        //           oField.setValueState("Error");
        //           oField.setValueStateText("Zorunlu alan");
        //         }
        //       } 
        //     });
        //   });
        //   // const aFE = oFC.getFormElements() || [];
        // });
        /* Form validation via code */

        // oTodoItem.ProjectId = this._sProjectId;
        // oTodoItem.ItemId = "0";

        // oModel.create("/TodoItemSet", oTodoItem, null, {
        //   success: (oData) => {},
        //   error: (oErrror) => {},
        // });

        // setTimeout(()=>{
        //     MessageBox.success("New todo has been added");
        //     this._oAddItemDialog.close();
        // },2000);
      },
      onDeleteTodo: function(oEvent){
        const oSource = oEvent.getSource();
        const oTodoItem = oSource?.getBindingContext()?.getObject();

        if(!oTodoItem){
            return;
        }

        const doDelete = ()=>{
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: true,
                timer: 2500
              });
        };

        this._callConfirmationDialog(
            this.getText("DELETE_TODO_TITLE"),
            this.getText("DELETE_TODO_TEXT", [oTodoItem.ItemDescription]),
            this.getText("DELETE_ACTION"),
            "Reject",
            doDelete
        )

      }, 

      /** Event handlers */
      _callConfirmationDialog: function(sTitle, sConfirmationText, sButtonText, sButtonType = "Accept", fnConfirmCallback){
        const oDialog = new Dialog({
            contentWidth: "300px",
            draggable: true,
            title: sTitle,
            content: [
                new VBox({
                    items:[
                        new Text({
                            text: sConfirmationText
                        }).addStyleClass("sapUiTinyMarginBottom"),
                        new Text({
                            text: this.getText("DO_YOU_CONFIRM")
                        })
                    ]
                })
            ],
            buttons: [
                new Button({
                    text:sButtonText,
                    type:sButtonType,
                    press: ()=>{
                        oDialog.close();
                        fnConfirmCallback && typeof fnConfirmCallback === "function" ? fnConfirmCallback() : null;
                    }
                }),
                new Button({
                    text:this.getText("CANCEL_ACTION"),
                    press: ()=>{
                        oDialog.close();
                    }
                })
            ],
            afterClose: ()=>{
                oDialog.destroy();
            }  
        }).addStyleClass("sapUiContentPadding");

        oDialog.open();
      },
      _resetTodoItem: function () {
        const oViewModel = this.getModel("detailViewModel");
        oViewModel.setProperty("/todoItem", this._initiateTodoItem());
      },
      _initiateTodoItem: function () {
        return {
          ProjectId: null,
          ItemId: null,
          ItemDescription: null,
          ItemStatus: null,
          Username: null,
          Category: null,
        };
      },
      _resetTodoItemValidation: function () {
        const oViewModel = this.getModel("detailViewModel");
        oViewModel.setProperty("/todoItemValidation", this._initiateTodoItemValidation());
      },
      _initiateTodoItemValidation: function () {
        return {
            ItemDescription:{
                ValueState: sap.ui.core.ValueState.None,
                ValueStateText: this.getText("FIELD_IS_OBLIGATORY", [this.getText("TODO_ITEM_DESCRIPTION")])   
            },
            ItemStatus:{
                ValueState: sap.ui.core.ValueState.None,
                ValueStateText: this.getText("FIELD_IS_OBLIGATORY", [this.getText("TODO_ITEM_STATUS")])   
            },
            Username:{
                ValueState: sap.ui.core.ValueState.None,
                ValueStateText: this.getText("FIELD_IS_OBLIGATORY", [this.getText("TODO_ITEM_USERNAME")])   
            },
            Category:{
                ValueState: sap.ui.core.ValueState.None,
                ValueStateText: this.getText("FIELD_IS_OBLIGATORY", [this.getText("TODO_ITEM_CATEGORY")])   
            }
          };
      },

    });
  }
);
