'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class RenameItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, oldName, newName) {
        super();
        this.model = initModel;
        this.oldName = oldName;
        this.newName = newName;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        // this.itemAdded = this.model.addNewItem();
        if (this.oldName != this.newName) {
            console.log(`change item name '${this.oldName}' to new name '${this.newName}'`);
        }
    }

    undoTransaction() {
        // this.model.removeItem(this.itemAdded.id);
        console.log(`change item name '${this.newName}' to old name '${this.oldName}'`);
    }
}