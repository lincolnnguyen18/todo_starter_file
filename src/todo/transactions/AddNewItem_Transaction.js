'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddNewItem_Transaction extends jsTPS_Transaction {
    constructor(initModel) {
        super();
        this.model = initModel;
        this.itemAdded = -1;
    }

    doTransaction() {
        // MAKE A NEW ITEM

        if (this.itemAdded !== -1) {
            this.model.currentList.addItem(this.itemAdded);
            console.log(this.model.view);
            this.model.loadList(this.model.currentList.id);
            return;
        }

        this.itemAdded = this.model.addNewItem();
        console.log(this.itemAdded);
        // this.id = this.itemAdded.id;
        // console.log(this.id);
    }

    undoTransaction() {
        this.model.removeItem(this.itemAdded.id);
    }
}