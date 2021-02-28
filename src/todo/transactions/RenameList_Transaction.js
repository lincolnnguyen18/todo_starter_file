'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class RenameItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, oldName, newName, listId) {
        super();
        this.model = initModel;
        this.oldName = oldName;
        this.newName = newName;
        this.listId = listId;
    }

    doTransaction() {
        // console.log(`change list name '${this.oldName}' to new name '${this.newName}'`);
        // console.log(`list id is ${this.listId}`);
        this.model.renameList(this.newName, this.listId);
    }

    undoTransaction() {
        // console.log(`change list name '${this.newName}' to old name '${this.oldName}'`);
        // console.log(`list id is ${this.listId}`);
        this.model.renameList(this.oldName, this.listId);
        // this.model.renameItem(this.itemId, this.oldName);
    }
}