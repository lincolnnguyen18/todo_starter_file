'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class DeleteItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemToDelete) {
        super();
        this.model = initModel;
        this.itemToDelete = itemToDelete;
    }

    doTransaction() {
        // Remove item based on its id
        this.model.removeItem(this.itemToDelete);
    }

    undoTransaction() {
        // Add item at its original index
        this.model.addItemAtItsIndex(this.itemToDelete);
    }
}