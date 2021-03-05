export default class ToDoController {    
    constructor() {}
    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;
        document.getElementById("add-list-button").onmouseup = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmouseup = function() {
            appModel.undo();
            appModel.setUndoRedoButtonStates();
        }
        document.getElementById("redo-button").onmouseup = function() {
            appModel.redo();
            appModel.setUndoRedoButtonStates();
        }
        document.getElementById("delete-list-button").onmouseup = function() {
            appModel.removeCurrentList();
            appModel.setAddItemDeleteListCloseListButtonState();
        }
        document.getElementById("add-item-button").onmouseup = function() {
            appModel.addNewItemTransaction();
            appModel.setUndoRedoButtonStates();
        }
        document.getElementById("close-list-button").onmouseup = function() {
            appModel.currentList = null;
            appModel.view.clearItemsList();
            appModel.view.clearCurrentListHighlight();
            appModel.setUndoRedoButtonStates();
            appModel.setAddItemDeleteListCloseListButtonState();
        }
    }
    handleLoadList(listId) {
        // if clicked list != current list (if it exists) then clear transaction stack
        let clickedListId = listId;
        let currentListId;
        let appModel = this.model;
        if (appModel.currentList != null && clickedListId != appModel.currentList.id) {
            currentListId = appModel.currentList.id;
            appModel.tps.clearAllTransactions();
            appModel.removeDeletedItemsFromCurrentList();
            appModel.resetItemIndices();
        }
        appModel.loadList(listId);
        appModel.view.refreshListsDefault();
        appModel.setUndoRedoButtonStates();
        // debug here
        let currentList = appModel.currentList;
        let transactionStack = appModel.tps.transactions;
    }
}