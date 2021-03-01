'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    toggleTextField(item) {
        let oldName = item.innerHTML;

        if (item.querySelector('input')) {
            return;
        }

        // console.log(item);

        let inputTextField = document.createElement("input");
        // inputTextField.innerHTML = `<input value="${item.innerHTML}">`;
        inputTextField.value = oldName;
        inputTextField.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                let textField = document.querySelector('input');
                textField.blur();
            }
        })
        inputTextField.addEventListener('focusout', ({ key }) => {
            let textField = document.querySelector('#todo-lists-list input');
            let newName = textField.value;
            inputTextField.innerHTML = `${newName}`;
            if (oldName != newName) {
                // console.log('oldname newname');
                let listId = item.getAttribute("id").split('-')[2];
                // console.log();
                this.controller.model.renameListTransaction(oldName, newName, listId);
            }
        })
        item.innerHTML = '';
        // console.log(item);
        item.appendChild(inputTextField);
        // console.log(item);
    }

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button");
        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        listElement.onclick = function() {
            thisController.handleLoadList(newList.id);
            // console.log(newList);
        }
        let thisView = this;
        listElement.ondblclick = function() {
            // console.log('DOUBE DOUBLE TROUBLE!');
            thisView.toggleTextField(document.getElementById(`todo-list-${newList.id}`));
            // thisController.model.renameListTransaction('Old', 'New');
            // console.log(thisController.model);
            let textField = document.querySelector('#todo-lists-list input');
            textField.select();
        }
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];
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

        // let undoEnabled = this.controller.model.tps.hasTransactionToRedo();
        // let redoEnabled = this.controller.model.tps.hasTransactionToUndo();
        // // let stack = this.controller.model.tps.transactions;
        // // let currentIndex = this.controller.model.tps.mostRecentTransaction;
        // console.log('undoEnabled:', redoEnabled);
        // console.log('redoEnabled:', undoEnabled);
        // // console.log(stack);
        // // console.log(currentIndex);

        // let undoButton = document.getElementById('undo-button');
        // let redoButton = document.getElementById('redo-button');
        // if (undoEnabled) {
        //     // undoButton.disabled = false;
        //     undoButton.classList.remove('disabled');
        // } else {
        //     // undoButton.disabled = true;
        //     undoButton.classList.add('disabled');
        // }
        // if (redoEnabled) {
        //     // undoButton.disabled = false;
        //     redoButton.classList.remove('disabled');
        // } else {
        //     // undoButton.disabled = true;
        //     redoButton.classList.add('disabled');
        // }



    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}