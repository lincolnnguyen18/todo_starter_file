export default class ToDoView {
    constructor() {}
    // SIDEBAR LISTS FUNCTIONS
    // **************************************************************
    appendNewListToView(newList) {
        let listsElement = document.getElementById("todo-lists-list");
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button");
        listElement.appendChild(document.createTextNode(newList.name));
        // if currentList != null, get currentListId
        let currentList = this.controller.model.currentList;
        let currentListId;
        if (currentList != null) {
            currentListId = this.controller.model.currentList.id;
        }
        // if currentListId == id of currentList then style it
        let listElementId = newList.id;
        if (currentListId == listElementId) {
            listElement.setAttribute("style", "background-color: red;");
        }
        listsElement.appendChild(listElement);
        // load list when clicked
        let thisController = this.controller;
        listElement.onmouseup = function() {
            thisController.handleLoadList(newList.id);
        }
    }
    refreshListsDefault() {
        this.controller.model.moveCurrentListToIndexZeroOfToDoLists();
        let lists = this.controller.model.toDoLists;
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";
        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }
    // LIST ITEM FUNCTIONS
    // **************************************************************
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    viewCurrentList() {
        this.viewList(this.controller.model.currentList);
    }
    viewList(list) {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        let numberOfVisibleItems = this.controller.model.getVisibleItems().length;
        this.clearItemsList();
        // put items of list into view
        for (let i = 0; i < list.items.length; i++) {
            let listItem = list.items[i];
            if (listItem.visible == true) {
                let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>"
                                    + "<div class='task-col'>" + listItem.description + "</div>"
                                    + "<div class='due-date-col'>" + listItem.dueDate + "</div>"
                                    + "<div class='status-col'>" + listItem.status + "</div>"
                                    + "<div class='list-controls-col'>"
                                    + " <div class='list-item-control material-icons'>keyboard_arrow_up</div>"
                                    + " <div class='list-item-control material-icons'>keyboard_arrow_down</div>"
                                    + " <div class='list-item-control material-icons'>close</div>"
                                    + " <div class='list-item-control'></div>"
                                    + " <div class='list-item-control'></div>"
                                    + "</div>";
                itemsListDiv.innerHTML += listItemElement;
            }
        }
        let moveItemUpButtons = document.querySelectorAll('#todo-list-items-div .list-item-control:nth-child(1)');
        let moveItemDownButtons = document.querySelectorAll('#todo-list-items-div .list-item-control:nth-child(2)');
        moveItemUpButtons[0].classList.add('disabled');
        moveItemDownButtons[moveItemUpButtons.length - 1].classList.add('disabled');
        // set events for list item controls
        for (let i = 0; i < list.items.length; i++) {
            let listItem = list.items[i];
            if (listItem.visible == true) {
                let listItemHTML = document.querySelector(`#todo-list-item-${listItem.id}`);
                let listItemControls = listItemHTML.getElementsByClassName('list-item-control');
                let listItemMoveUp = listItemControls[0];
                let listItemMoveDown = listItemControls[1];
                let listItemDelete = listItemControls[2];
                let model = this.controller.model;
                listItemDelete.onmouseup = function() {
                    // listItem example
                    // ToDoListItem {id: 2, description: "Make You Cry", dueDate: "2019-12-30", status: "incomplete", index: 2}
                    model.deleteItemTransaction(listItem);
                    model.setUndoRedoButtonStates();
                }
                listItemMoveUp.onmouseup = function() {
                    model.moveItemUpTransaction(listItem);
                    model.setUndoRedoButtonStates();
                }
                listItemMoveDown.onmouseup = function() {
                    model.moveItemDownTransaction(listItem);
                    model.setUndoRedoButtonStates();
                }
            }
        }
        this.controller.model.setAddItemDeleteListCloseListButtonState();
    }
    // MISC.
    // **************************************************************
    setController(initController) {
        this.controller = initController;
    }
}