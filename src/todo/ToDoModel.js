'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import AddList_Transaction from './transactions/AddList_Transaction.js'
import DeleteList_Transaction from './transactions/DeleteList_Transaction.js'
import RenameItem_Transaction from './transactions/RenameItem_Transaction.js'
import RenameList_Transaction from './transactions/RenameList_Transaction.js'

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};

function findListIndex(toDoLists, listId) {
    let listIndex = -1;
    for (let i = 0; (i < toDoLists.length) && (listIndex < 0); i++) {
        // console.log(listId);
        // console.log(toDoLists[i].id);
        if (toDoLists[i].id == listId)
            listIndex = i;
    }
    return listIndex;
}

// function itemIndex(toDoLists, listId, itemId) {
//     let itemIndex = -1;
//     for (let i = 0; (i < toDoLists.length) && (itemIndex < 0); i++) {
//         if (toDoLists[i].id == listId)
//             listIndex = i;
//     }
//     return itemIndex;
// }

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {

    findListIndex2(listId) {
        let listIndex = -1;
        // console.log(this.toDoLists);
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            // console.log(listId);
            // console.log(this.toDoLists[i].id);
            // console.log(this.toDoLists[i].id == listId);
            if (this.toDoLists[i].id == listId)
                listIndex = i;
        }
        return listIndex;
    }



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

    findItemIndex(list, itemId) {
        let itemIndex = -1;
        // console.log(list);
        for (let i = 0; (i < list.length) && (itemIndex < 0); i++) {
            // console.log(list[i].id);
            if (list[i].id == itemId)
                itemIndex = i;
        }
        return itemIndex;
    }

    renameList(newName, listId) {
        // console.log('renameList called!');
        // console.log(this.toDoLists);
        let listIndex = findListIndex(this.toDoLists, listId);
        // console.log(listIndex);
        this.toDoLists[listIndex].name = newName;
        // this.moveListToIndex0(listId);


        let currentListId = this.currentList.id;
        this.view.refreshLists(this.toDoLists);
        document.getElementById(`todo-list-${currentListId}`).click();


        // this.view.refreshLists(this.toDoLists);
    }

    renameItem(itemId, newName) {
        // console.log('id of ixtem to rename is: ', itemId);
        // console.log(this.toDoLists);
        let itemIndex = this.findItemIndex(this.currentList.items, itemId);
        // console.log(this.currentList.items);
        // console.log(itemIndex);
        this.currentList.items[itemIndex].description = newName;
        this.loadList(this.currentList.id);
    }

    moveListToIndex0(listId) {
        let oldIndex = findListIndex(this.toDoLists, listId);
        let newIndex = 0;
        array_move(this.toDoLists, oldIndex, newIndex);
        this.view.refreshLists(this.toDoLists);

        this.currentList = this.toDoLists[0];
        
        let newCurrentList = document.getElementById(`todo-list-${this.currentList.id}`);
        newCurrentList.style.backgroundColor = '#ffc800';
        newCurrentList.style.color = '#202329';
        this.currentList = this.toDoLists[0];
        this.loadList(this.currentList.id);
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

    addListTransaction() {
        let transaction = new AddList_Transaction(this);
        this.tps.addTransaction(transaction);
    }

    deleteListTransaction() {
        let transaction = new DeleteList_Transaction(this);
        this.tps.addTransaction(transaction);
    }
    
    renameItemTransaction(oldName, newName, itemId) {
        let transaction = new RenameItem_Transaction(this, oldName, newName, itemId);
        this.tps.addTransaction(transaction);
    }

    renameListTransaction(oldName, newName, listId) {
        let transaction = new RenameList_Transaction(this, oldName, newName, listId);
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
        this.currentList.items.push(newItem);
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
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }
        this.toDoLists.splice(indexOfList, 1);
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshLists(this.toDoLists);
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
            console.log(this.tps.transactions);
        } else {
            console.log("no more undo!");
        }
    } 

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
            console.log(this.tps.transactions);
        } else {
            console.log("no more redo!");
        }
    } 
}