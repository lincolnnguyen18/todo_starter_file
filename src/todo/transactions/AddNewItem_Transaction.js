'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddNewItem_Transaction extends jsTPS_Transaction {
    constructor(initModel) {
        super();
        this.model = initModel;
        this.itemAdded = null;
    }

    doTransaction() {
        let model = this.model;
        // if itemAdded == null then create initial item
        if (this.itemAdded == null)
            this.itemAdded = model.addNewItem();
        // else (redoing addItem), add saved itemAdded at its original index and refresh list in view
        else
            model.currentList.addItemAtItsIndex(this.itemAdded);
            model.view.viewList(model.currentList);
    }

    undoTransaction() {
        this.model.removeItem(this.itemAdded.id);
    }
}