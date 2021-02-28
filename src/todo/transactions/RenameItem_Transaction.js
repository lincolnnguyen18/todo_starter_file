'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class RenameItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, oldName, newName, itemId) {
        super();
        this.model = initModel;
        this.oldName = oldName;
        this.newName = newName;
        this.itemId = itemId;
    }

    doTransaction() {
        // MAKE A NEW ITEM
        // this.itemAdded = this.model.addNewItem();
        // console.log(`change item name '${this.oldName}' to new name '${this.newName}'`);
        this.model.renameItem(this.itemId, this.newName);
    }

    undoTransaction() {
        // this.model.removeItem(this.itemAdded.id);
        // console.log(`change item name '${this.newName}' to old name '${this.oldName}'`);
        this.model.renameItem(this.itemId, this.oldName);
    }
}