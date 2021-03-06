import { jsTPS_Transaction } from "../../common/jsTPS.js"
export default class MoveItemUp_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemToMove) {
        super();
        this.model = initModel;
        this.itemMoved = itemToMove;
    }
    doTransaction() {
        let model = this.model;
        let currentList = model.currentList.items;
        let itemMovedIndex = this.itemMoved.index;
        let itemMoved = currentList[itemMovedIndex];
        let itemAboveItemMoved = currentList[itemMovedIndex - 1];
        while (itemAboveItemMoved.visible != true) {
            itemAboveItemMoved = currentList[itemAboveItemMoved.index - 1];
        }
        model.switchTwoItemsInCurrentList(itemMoved, itemAboveItemMoved);
        model.view.viewCurrentList();
        model.view.scrollItemIntoView(this.itemMoved);
        model.view.highlightItemTemporarily(itemAboveItemMoved);
    }
    undoTransaction() {
        let model = this.model;
        let currentList = model.currentList.items;
        let itemMovedIndex = this.itemMoved.index;
        let itemMoved = currentList[itemMovedIndex];
        let itemAboveItemMoved = currentList[itemMovedIndex - 1];
        while (itemAboveItemMoved.visible != true) {
            itemAboveItemMoved = currentList[itemAboveItemMoved.index - 1];
        }
        model.switchTwoItemsInCurrentList(itemMoved, itemAboveItemMoved);
        model.view.viewCurrentList();
        this.model.view.scrollItemIntoView(this.itemMoved);
        this.model.view.highlightItemTemporarily(this.itemMoved);
    }
}