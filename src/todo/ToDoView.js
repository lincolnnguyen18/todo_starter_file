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
        let model = this.controller.model;
        let listItemTemplate = document.getElementById('listItemTemplate');
        this.clearItemsList();
        // put items of list into view
        for (let i = 0; i < list.items.length; i++) {
            let listItem = list.items[i];
            if (listItem.visible == true) {
                let listItemElement = listItemTemplate.content.cloneNode(true);
                listItemElement.querySelector('#todo-list-item-0').id = `todo-list-item-${listItem.id}`;
                listItemElement.querySelector('.task-col').innerHTML = listItem.description;
                listItemElement.querySelector('.due-date-col').innerHTML = listItem.dueDate;
                listItemElement.querySelector('.status-col').innerHTML = listItem.status;
                listItemElement.querySelectorAll('.list-item-control')[0].onmouseup = function() {
                    model.moveItemUpTransaction(listItem);
                    model.setUndoRedoButtonStates();
                }
                listItemElement.querySelectorAll('.list-item-control')[1].onmouseup = function() {
                    model.moveItemDownTransaction(listItem);
                    model.setUndoRedoButtonStates();
                }
                listItemElement.querySelectorAll('.list-item-control')[2].onmouseup = function() {
                    model.deleteItemTransaction(listItem);
                    model.setUndoRedoButtonStates();
                }
                itemsListDiv.appendChild(listItemElement);
            }
        }
        let moveItemUpButtons = document.querySelectorAll('#todo-list-items-div .list-item-control:nth-child(1)');
        let moveItemDownButtons = document.querySelectorAll('#todo-list-items-div .list-item-control:nth-child(2)');
        moveItemUpButtons[0].classList.add('disabled');
        moveItemDownButtons[moveItemUpButtons.length - 1].classList.add('disabled');
        // add rename event for itemNames
        let itemNames = document.querySelectorAll('#todo-list-items-div .task-col');
        itemNames.forEach((itemName) => {
            itemName.onmouseup = function() {
                if (itemName.getElementsByTagName('input')[0] != null)
                    return;
                let textField = document.createElement('input');
                textField.value = itemName.innerHTML;
                textField.onblur = function() {
                    itemName.innerHTML = textField.value;
                    model.currentList.items
                }
                textField.addEventListener('keyup', ({ key }) => {
                    if (key === 'Enter') {
                        let textField = itemName.getElementsByTagName('input')[0].blur();
                    }
                })
                itemName.innerHTML = '';
                itemName.appendChild(textField);
                itemName.getElementsByTagName('input')[0].select();
            }
        });
        model.setAddItemDeleteListCloseListButtonState();
    }
    // MISC.
    // **************************************************************
    setController(initController) {
        this.controller = initController;
    }
}