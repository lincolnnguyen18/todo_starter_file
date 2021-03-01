'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;
    }

    clearTransactionStack() {
        let transactionStack = this.tps.transactions;
        this.tps.clearAllTransactions();
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

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
    }

    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        // Set newItem's index
        let currentList = this.currentList.items;
        let newItemIndex = currentList.length - 1;
        newItem.index = newItemIndex
        this.currentList.items.push(newItem);
        let newItemState = newItem;
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
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

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    setUndoRedoButtonStates() {
        let undoState = this.tps.hasTransactionToUndo();
        let redoState = this.tps.hasTransactionToRedo();
        let undoButton = document.getElementById('undo-button');
        let redoButton = document.getElementById('redo-button');
        if (undoState != true)
            undoButton.setAttribute("style", "background-color: red;");
        else
            undoButton.setAttribute("style", "background-color: transparent;");
        if (redoState != true)
            redoButton.setAttribute("style", "background-color: red;");
        else
            redoButton.setAttribute("style", "background-color: transparent;");
    }

    setAddItemDeleteListButtonState() {
        let addAndDeleteListState;
        let addButton = document.getElementById('add-item-button');
        let deleteListButton = document.getElementById('delete-list-button');
        if (this.currentList != null)
            addAndDeleteListState = true;
        else
            addAndDeleteListState = false;
        if (addAndDeleteListState != true) {
            addButton.setAttribute("style", "background-color: red;");
            deleteListButton.setAttribute("style", "background-color: red;");
        } else {
            addButton.setAttribute("style", "background-color: transparent;");
            deleteListButton.setAttribute("style", "background-color: transparent;");   
        }
    }

    /**
     * Finds and then removes the current list.
     */
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

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
    } 
}