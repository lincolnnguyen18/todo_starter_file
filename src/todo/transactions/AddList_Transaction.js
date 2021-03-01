'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class AddList_Transaction extends jsTPS_Transaction {
    constructor(initModel, name) {
        super();
        this.model = initModel;
        this.name = name;
    }

    doTransaction() {
        // this.itemAdded = this.model.addNewItem();
        // this.deletedList = this.model.currentList;
        // this.model.removeCurrentList();
        this.model.addNewList(name);
        this.addedListId = this.model.toDoLists[this.model.toDoLists.length - 1].id;
        // console.log('new list id: ', this.addedListId);
    }

    undoTransaction() {
        // this.model.removeItem(this.itemAdded.id);
        let listToUndoIndex = this.model.findListIndex2(this.addedListId);
        // console.log(listToUndoIndex);

        this.model.toDoLists.splice(listToUndoIndex, 1);
        // console.log(this.model.toDoLists);

        // this.model.toDoLists.push(this.deletedList);
        // this.model.moveListToIndex0(this.deletedList.id);
        this.model.view.refreshLists(this.model.toDoLists);
    }
}