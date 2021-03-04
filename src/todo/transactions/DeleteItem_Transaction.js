import { jsTPS_Transaction } from "../../common/jsTPS.js"
export default class DeleteItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemToDelete) {
        super();
        this.model = initModel;
        this.itemDeleted = itemToDelete;
    }
    doTransaction() {
        let model = this.model;
        let itemAboveDeletedItem = model.getVisibleItemAboveItem(this.itemDeleted);
        let currentList = model.currentList.items;
        let itemDeletedIndex = this.itemDeleted.index;
        currentList[itemDeletedIndex].visible = false;
        model.view.viewCurrentList();
        if (itemAboveDeletedItem != null)
            model.view.scrollItemIntoView(itemAboveDeletedItem);
    }
    undoTransaction() {
        let model = this.model;
        let currentList = model.currentList.items;
        let itemDeletedIndex = this.itemDeleted.index;
        currentList[itemDeletedIndex].visible = true;
        model.view.viewCurrentList();
        model.view.scrollItemIntoView(this.itemDeleted);
    }
}