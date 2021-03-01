'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
            appModel.setUndoRedoButtonStates();
        }
        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
            appModel.setUndoRedoButtonStates();
        }
        document.getElementById("delete-list-button").onmousedown = function() {
            appModel.removeCurrentList();
            appModel.setAddItemDeleteListButtonState();
        }
        document.getElementById("add-item-button").onmousedown = function() {
            appModel.addNewItemTransaction();
            appModel.setUndoRedoButtonStates();
        }
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // If clicked list != current list (if it exists) then clear transaction stack
        let clickedListId = listId;
        let currentListId;
        let transactionStackBefore = this.model.tps.transactions;
        if (this.model.currentList != null && clickedListId != this.model.currentList.id) {
            currentListId = this.model.currentList.id;
            this.model.clearTransactionStack();
        }
        let transactionStackAfter = this.model.tps.transactions;
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
        // Refresh lists each time a list is clicked
        this.model.view.refreshListsDefault();
        // Update undo redo button states (for when transaction stack is cleared and buttons become disabled)
        this.model.setUndoRedoButtonStates();
    }
}