import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction.js'
import MoveItemUp_Transaction from './transactions/MoveItemUp_Transaction.js'
export default class ToDoModel {
    constructor() {
        this.toDoLists = [];
        this.currentList = null;
        this.tps = new jsTPS();
        this.nextListId = 0;
        this.nextListItemId = 0;
    }
    // ITEM FUNCTIONS
    // **************************************************************
    switchTwoItemsInCurrentList(item1, item2) {
        [item1.id, item2.id] = [item2.id, item1.id];
        [item1.description, item2.description] = [item2.description, item1.description];
        [item1.dueDate, item2.dueDate] = [item2.dueDate, item1.dueDate];
        [item1.status, item2.status] = [item2.status, item1.status];
    }
    removeDeletedItemsFromCurrentList() {
        if (this.currentList != null) {
            this.currentList.items = this.getVisibleItems();
        }
    }
    resetItemIndices() {
        for (let i = 0; i < this.currentList.items.length; i++) {
            this.currentList.items[i].index = i;
        }
    }
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.description = initDescription;
        newItem.dueDate = initDueDate;
        newItem.status = initStatus;
        newItem.index = list.items.length;
        newItem.visible = true;
        list.items.push(newItem);
    }
    getNewItemIndexForCurrentList() {
        let currentList = this.currentList.items;
        let newItemIndex = currentList.length;
        return newItemIndex;
    }
    // add new default item to current list and returns it
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.index = this.getNewItemIndexForCurrentList();
        this.currentList.items.push(newItem);
        return newItem;
    }
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
    }
    deleteItemTransaction(itemToDelete) {
        let transaction = new DeleteItem_Transaction(this, itemToDelete);
        this.tps.addTransaction(transaction);
    }
    moveItemUpTransaction(itemToMove) {
        let transaction = new MoveItemUp_Transaction(this, itemToMove);
        this.tps.addTransaction(transaction);
    }
    // LIST FUNCTIONS
    // **************************************************************
    getVisibleItems() {
        if (this.currentList == null)
            return null;
        return this.currentList.items.filter(function (item) {
            return item.visible == true;
        });
    }
    moveCurrentListToIndexZeroOfToDoLists() {
        // Get index of currentList
        let currentListIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (currentListIndex < 0) && this.currentList != null; i++) {
            if (this.toDoLists[i].id == this.currentList.id)
            currentListIndex = i;
        }
        // If currentList != null, move currentList to index 0 of toDoLists
        let oldArray = this.toDoLists;
        if (currentListIndex >= 0) {
            let currentList = oldArray.splice(currentListIndex, 1)[0];
            oldArray.unshift(currentList);
        }
    }
    addNewList(initName) {
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.name = initName;
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }
    // load list with listId in view
    loadList(listId) {
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let listToLoad = this.toDoLists[listIndex];
            this.currentList = listToLoad;
            this.view.viewList(this.currentList);
        }
    }
    removeCurrentList() {
        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0) && this.currentList != null; i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }
        this.toDoLists.splice(indexOfList, 1);
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshListsDefault();
    }
    // UNDO REDO AND MISC.
    // **************************************************************
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
    }
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
    }
    setUndoRedoButtonStates() {
        let undoState = this.tps.hasTransactionToUndo();
        let redoState = this.tps.hasTransactionToRedo();
        let undoButton = document.getElementById('undo-button');
        let redoButton = document.getElementById('redo-button');
        if (undoState != true)
            undoButton.classList.add('disabled');
        else
            undoButton.classList.remove('disabled');
        if (redoState != true)
            redoButton.classList.add('disabled');
        else
            redoButton.classList.remove('disabled');
    }
    setAddItemDeleteListCloseListButtonState() {
        let addAndDeleteListState;
        let addButton = document.getElementById('add-item-button');
        let deleteListButton = document.getElementById('delete-list-button');
        let closeListButton = document.getElementById('close-list-button');
        if (this.currentList != null)
            addAndDeleteListState = true;
        else
            addAndDeleteListState = false;
        if (addAndDeleteListState != true) {
            addButton.classList.add('disabled');
            deleteListButton.classList.add('disabled');
            closeListButton.classList.add('disabled');
        } else {
            addButton.classList.remove('disabled');
            deleteListButton.classList.remove('disabled');
            closeListButton.classList.remove('disabled');
        }
    }
    setView(initView) {
        this.view = initView;
    }
}