export default class ToDoView {
    constructor() {}
    // SIDEBAR LISTS FUNCTIONS
    // **************************************************************
    clearCurrentListHighlight() {
        let todoListsList = document.getElementById("todo-lists-list");
        todoListsList.querySelectorAll(".todo_button")[0].removeAttribute("style");
    }
    appendNewListToView(newList) {
        let listsElement = document.getElementById("todo-lists-list");
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.id = newListId;
        listElement.classList.add("todo_button");
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
            listElement.style.background = "#ffc800";
            listElement.style.color = "#000";
            listElement.style.fontWeight = "bold";
            listElement.classList.remove("todo_button");
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
    scrollItemIntoView(item) {
        let theItem = document.getElementById(`todo-list-item-${item.id}`);
        theItem.scrollIntoViewIfNeeded(true);
        // this.highlightItemTemporarily(theItem);
    }
    highlightItemTemporarily(item) {
        let itemInDocument = document.getElementById(`todo-list-item-${item.id}`);
        itemInDocument.classList.add("undidOrRedidItem");
        setTimeout(function(){
            itemInDocument.classList.remove("undidOrRedidItem");
        }, 3000);
    }
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
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        return [year, month, day].join('-');
    }
    viewList(list) {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        let numberOfVisibleItems = this.controller.model.getVisibleItems().length;
        let model = this.controller.model;
        // let listItemTemplate = document.getElementById('listItemTemplate');
        this.clearItemsList();
        // put items of list into view
        for (let i = 0; i < list.items.length; i++) {
            let listItem = list.items[i];
            if (listItem.visible == true) {
                let listItemElement = listItemTemplate.content.cloneNode(true);
                listItemElement.querySelector('#todo-list-item-0').id = `todo-list-item-${listItem.id}`;
                listItemElement.querySelector('.task-col').innerHTML = listItem.description;
                listItemElement.querySelector('.due-date-col').innerHTML = this.formatDate(listItem.dueDate);
                listItemElement.querySelector('.status-col').querySelector('.dropbtn').innerHTML = listItem.status;
                listItemElement.querySelector('.status-col').classList.add(listItem.status);
                // open dropdown list
                listItemElement.querySelector('.dropbtn').addEventListener('click', function(){
                    event.stopPropagation();
                    let dropdownContainer = this.parentElement;
                    let dropDownToShow = dropdownContainer.querySelector('#myDropdown');
                    dropDownToShow.classList.toggle('showDropdown');
                    // this.blur();
                    // unfocus button when dropdown is toggled closed
                    if (!dropDownToShow.classList.contains('showDropdown')) {
                        this.blur();
                    }
                });
                // close dropdown list
                listItemElement.querySelector('.dropbtn').addEventListener('focusout', function(event){
                    let dropdownContainer = this.parentElement;
                    let dropDownToShow = dropdownContainer.querySelector('#myDropdown');
                    let relatedTarget = event.relatedTarget;
                    if (event.relatedTarget) {
                        let clickedItem = event.relatedTarget;
                        // if new target is another dropdown button then close the dropdown
                        if (clickedItem.classList.contains('dropbtn'))
                            dropDownToShow.classList.remove('showDropdown');
                        let actualClickedItemId = clickedItem.closest('.list-item-card').id.split('-')[3];
                        let actualClickedItem = model.getItemInCurrentListById(actualClickedItemId);
                        if (clickedItem.innerHTML == actualClickedItem.status)
                            return;
                        if (clickedItem.innerHTML == 'complete') {
                            model.setCompleteTransaction(actualClickedItem);
                            model.setUndoRedoButtonStates();
                        }
                        if (clickedItem.innerHTML == 'incomplete') {
                            model.setIncompleteTransaction(actualClickedItem);
                            model.setUndoRedoButtonStates();
                        }
                        // if new target is the dropdown menu then don't close the dropdown
                        if (clickedItem.parentElement.id == 'myDropdown') {
                            let newStatus = clickedItem;
                            newStatus = clickedItem.innerHTML;
                            newStatus = clickedItem.innerHTML;
                            return;
                        }
                    // if new target is unrelated then close the dropdown
                    } else {
                        dropDownToShow.classList.remove('showDropdown');
                    }
                });
                // update status
                listItemElement.querySelectorAll('#myDropdown div')[0].onmouseup = function() {
                    let statusId = this.closest('.list-item-card').id.split('-')[3];
                    this.closest('#myDropdown').classList.remove('showDropdown');
                }
                listItemElement.querySelectorAll('#myDropdown div')[1].onmouseup = function() {
                    let statusId = this.closest('.list-item-card').id.split('-')[3];
                    this.closest('#myDropdown').classList.remove('showDropdown');
                }
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
                    let itemInListToRename = model.getItemInCurrentListById(itemName.closest('.list-item-card').id.split('-')[3]);
                    if (textField.value == itemInListToRename.description)
                        return;
                    model.renameItemTransaction(itemInListToRename, textField.value);
                    model.setUndoRedoButtonStates();
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
        // add change due date event for due dates
        let dueDates = document.querySelectorAll('#todo-list-items-div .due-date-col');
        let thisView = this;
        dueDates.forEach((dueDate) => {
            dueDate.onmouseup = function() {
                if (dueDate.getElementsByTagName('input')[0] != null)
                    return;
                let dateField = document.createElement('input');
                dateField.type = "date";
                dateField.value = dueDate.innerHTML;
                dateField.onblur = function() {
                    let textField = document.querySelector(".due-date-col input");
                    let dateValues = textField.value.split('-');
                    let dateObject = new Date(dateValues[0], dateValues[1] - 1, dateValues[2]);
                    dueDate.innerHTML = textField.value;
                    let itemInListToChangeDate = model.getItemInCurrentListById(dueDate.closest('.list-item-card').id.split('-')[3]);
                    if (textField.value == thisView.formatDate(itemInListToChangeDate.dueDate))
                        return;
                    model.changeDateTransaction(itemInListToChangeDate, dateObject);
                    model.setUndoRedoButtonStates();
                }
                dateField.addEventListener('keyup', ({ key }) => {
                    if (key === 'Enter') {
                        let dateField = dueDate.getElementsByTagName('input')[0].blur();
                    }
                })
                dueDate.innerHTML = '';
                dueDate.appendChild(dateField);
                dateField.focus();
            }
        });
        let moveItemUpButtons = document.querySelectorAll('#todo-list-items-div .list-item-control:nth-child(1)');
        let moveItemDownButtons = document.querySelectorAll('#todo-list-items-div .list-item-control:nth-child(2)');
        let firstMoveItemUpButtons = moveItemUpButtons[0];
        let lastMoveItemDownButton = moveItemDownButtons[moveItemUpButtons.length - 1];
        if (firstMoveItemUpButtons != null)
            firstMoveItemUpButtons.classList.add('disabled');
        if (lastMoveItemDownButton != null)
            lastMoveItemDownButton.classList.add('disabled');
        model.setAddItemDeleteListCloseListButtonState();
        // // add selectStatus event for itemStatuses
        // let itemStatuses = document.querySelectorAll('#todo-list-items-div .status-col');
        // // let statusDropdownMenuTemplate = document.getElementById('statusDropdownMenuTemplate');
        // itemStatuses.forEach((itemStatus) => {
        //     itemStatus.onmouseup = function() {
        //         // itemStatus.style.backgroundColor = "black";
        //         // itemStatus.innerHTML = "";
        //         // let statusDropDownMenu = statusDropdownMenuTemplate.content.cloneNode(true);
        //         // itemStatus.appendChild(statusDropDownMenu);
        //         let statusDropDownMenu = itemStatus.querySelector('#myDropdown');
        //         this.classList.add('show');
        //         model.view.viewCurrentList();
        //     }
        // });
    }
    // MISC.
    // **************************************************************
    setController(initController) {
        this.controller = initController;
    }
}