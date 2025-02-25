export default class ToDoController {    
    constructor() {}
    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;
        document.getElementById("add-list-button").onmouseup = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmouseup = function() {
            if (!this.classList.contains('disabled')) {
                appModel.undo();
                appModel.setUndoRedoButtonStates();
            }
        }
        document.getElementById("redo-button").onmouseup = function() {
            if (!this.classList.contains('disabled')) {
                appModel.redo();
                appModel.setUndoRedoButtonStates();
            }
        }
        document.getElementById("delete-list-button").onmouseup = function() {
            // appModel.removeCurrentList();
            // appModel.setAddItemDeleteListCloseListButtonState();
            if (!this.classList.contains('disabled')) {
                document.getElementById("modal_container").classList.add('show');
                console.log("open clicked!");
            }
        }
        document.getElementById("modal-cancel1").onmouseup = function() {
            modal_container.classList.remove('show');
        }
        document.getElementById("modal-cancel2").onmouseup = function() {
            modal_container.classList.remove('show');
        }
        document.getElementById("modal-confirm").onmouseup  = function() {
            appModel.removeCurrentList();
            modal_container.classList.remove('show');
            console.log("list deleted!");
            appModel.tps.clearAllTransactions();
            appModel.setUndoRedoButtonStates();
            appModel.setAddItemDeleteListCloseListButtonState();
        }
        document.getElementById("add-item-button").onmouseup = function() {
            appModel.addNewItemTransaction();
            appModel.setUndoRedoButtonStates();
        }
        document.getElementById("close-list-button").onmouseup = function() {
            if (!this.classList.contains('disabled')) {
                appModel.currentList = null;
                appModel.view.clearItemsList();
                appModel.view.clearCurrentListHighlight();
                appModel.tps.clearAllTransactions();
                appModel.setUndoRedoButtonStates();
                appModel.setAddItemDeleteListCloseListButtonState();
            }
        }
    }
    handleLoadList(listId) {
        // if clicked list != current list (if it exists) then clear transaction stack
        let clickedListId = listId;
        let currentListId;
        let appModel = this.model;
        appModel.tps.clearAllTransactions();
        if (appModel.currentList != null && clickedListId != appModel.currentList.id) {
            currentListId = appModel.currentList.id;
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