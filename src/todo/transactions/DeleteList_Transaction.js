'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class DeleteList_Transaction extends jsTPS_Transaction {
    constructor(initModel) {
        super();
        this.model = initModel;
        this.deletedList = -1;
    }

    doTransaction() {
        if (this.deletedList != -1) {
            let index = this.model.findListIndex2(this.deletedList.id);
            this.model.toDoLists.splice(index, 1);
            this.model.view.refreshLists(this.model.toDoLists);
            if (this.model.currentList) {
                document.getElementById(`todo-list-${this.model.currentList.id}`).click();  
            }
            return;
        }

        // this.itemAdded = this.model.addNewItem();
        this.deletedList = this.model.currentList;
        this.model.removeCurrentList();
    }

    undoTransaction() {
        // this.model.removeItem(this.itemAdded.id);
        this.model.toDoLists.push(this.deletedList);
        // this.model.moveListToIndex0(this.deletedList.id);
        this.model.view.refreshLists(this.model.toDoLists);
    }
}