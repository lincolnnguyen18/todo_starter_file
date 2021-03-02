import { jsTPS_Transaction } from "../../common/jsTPS.js"
export default class DeleteItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemToDelete) {
        super();
        this.model = initModel;
        this.itemDeleted = itemToDelete;
    }
    doTransaction() {
        let currentList = this.model.currentList.items;
        let itemDeletedIndex = this.itemDeleted.index;
        currentList[itemDeletedIndex].visible = false;
        this.model.view.viewCurrentList();
    }
    undoTransaction() {
        let currentList = this.model.currentList.items;
        let itemDeletedIndex = this.itemDeleted.index;
        currentList[itemDeletedIndex].visible = true;
        this.model.view.viewCurrentList();
    }
}