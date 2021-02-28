'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class DeleteList_Transaction extends jsTPS_Transaction {
    constructor(initModel) {
        super();
        this.model = initModel;
    }

    doTransaction() {
        // this.itemAdded = this.model.addNewItem();
        this.deletedList = this.model.currentList;
        this.model.removeCurrentList();
    }

    undoTransaction() {
        // this.model.removeItem(this.itemAdded.id);
        this.model.toDoLists.push(this.deletedList);
        this.model.moveListToIndex0(this.deletedList.id);
        // this.model.view.refreshLists(this.model.toDoLists);
    }
}