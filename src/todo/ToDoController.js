'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */

export default class ToDoController {    

    toggleTextField(item, list, itemId) {

        // console.log(item);

        // this.untoggleTextField(list);
        // console.log(item.innerHTML);

        let oldName = item.innerHTML;

        let inputTextField = document.createElement("div");
        inputTextField.innerHTML = `<input value="${item.innerHTML}">`;
        inputTextField.classList.add('task-col');
        inputTextField.addEventListener('keyup', ({key}) => {
            if (key === 'Enter') {
                let textField = inputTextField.querySelector('input');
                // // console.log(textField.value);
                // let newName = textField.value;
                // inputTextField.innerHTML = `${newName}`;
                textField.blur();
            }
        })
        inputTextField.addEventListener('focusout', ({key}) => {
            // console.log(inputTextField.value);

            let textField = inputTextField.querySelector('input');
            let newName = textField.value;
            inputTextField.innerHTML = `${newName}`;

            // let listId = textField.parentNode.id;

            // this.model.renameItemTransaction(oldName, newName, listId, itemId);
            this.model.renameItemTransaction(oldName, newName);
            // console.log('item id clicked on is: ', itemId);
            this.model.renameItem(itemId, newName);
        })

        item.replaceWith(inputTextField);

        // console.log(item);

        // item.setSelectionRange(0, newName.length);
    }

    // untoggleTextField    (list, oldName) {
    //     // console.log('untoggleTextField!');
    //     // console.log(list);
    //     let names = list.querySelectorAll('.task-col');
    //     // console.log(names);

    //     for (let i = 0; i < names.length; i++) {
    //         let currentItem = names[i];

    //         // console.log(currentItem.innerHTML);

    //         let textFields = currentItem.getElementsByTagName("input");
    //         if (textFields.length > 0) {
    //             // console.log(textFields[0].value);

    //             // let listItem = document.createElement("div");
    //             // listItem.innerHTML = textFields[0].value;
    //             // listItem.classList.add('task-col');
    //             // listItem.onclick = function() {
    //             //     toggleTextField(listItem, list);
    //             // }
    //             // textFields[0].replaceWith(listItem);

    //             // console.log(oldName);
    //             let newName = textFields[0].value;
    //             this.model.renameItemTransaction(oldName, newName);

    //             textFields[0].replaceWith(textFields[0].value);
    //         }
    //     }
    // }

    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        function deleteShortcut(e) {
            if (e.key === 'Delete') {
                document.getElementById("modal_container").classList.add('show');
            }
        }
        document.addEventListener('keydown', deleteShortcut, false);

        function undoShortcut(e) {
            if (e.ctrlKey && e.key === 'z') {
                appModel.undo();
            }
        }
        document.addEventListener('keydown', undoShortcut, false);

        function redoShortcut(e) {
            if (e.ctrlKey && e.key === 'y') {
                appModel.redo();
            }
        }
        document.addEventListener('keydown', redoShortcut, false);

        function confirmShortcut(e) {
            if (modal_container.classList.contains('show') && e.key === 'Enter') {
                appModel.deleteListTransaction();
                modal_container.classList.remove('show');
            }
        }
        document.addEventListener('keydown', confirmShortcut, false);

        function cancelShortcut(e) {
            if (modal_container.classList.contains('show') && e.key === 'Escape') {
                modal_container.classList.remove('show');
            }
        }
        document.addEventListener('keydown', cancelShortcut, false);



        // let list = document.getElementById("todo-list-items-div").getElementsByClassName("list-item-card");
        // console.log(list);


        document.getElementById("todo-list-items-div").onclick = e => {
            let listOfNames = document.getElementById('todo-list-items-div');
            // console.log(listOfNames);

            // untoggleTextField(listOfNames);


            let clickedItemComponentInList = e.target;

            // console.log(clickedItemComponentInList.parentNode.parentNode);

            let itemId = e.target.parentNode.id.split('-')[3];
            // console.log('item id clicked on is: ', itemId);


            // console.log(clickedItemComponentInList);
            if (clickedItemComponentInList.classList.contains('task-col')) {
                let name = clickedItemComponentInList;
                // console.log(name);

                this.toggleTextField(name, listOfNames, itemId);



                // let textField = clickedItemComponentInList;
                let textFields = document.getElementsByTagName('input');
                // console.log(textFields[0]);
                textFields[0].select();
            }
        }










        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmouseup = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmouseup = function() {
            appModel.undo();
        }
        document.getElementById("redo-button").onmouseup = function() {
            appModel.redo();
        }
        document.getElementById("delete-list-button").onmouseup = function() {
            // appModel.removeCurrentList();
            document.getElementById("modal_container").classList.add('show');
            console.log("open clicked!");
        }
        document.getElementById("add-item-button").onmouseup = function() {
            appModel.addNewItemTransaction();
        }
        document.getElementById("modal-cancel1").onmouseup = function() {
            modal_container.classList.remove('show');
            console.log("close clicked!");
        }
        document.getElementById("modal-cancel2").onmouseup = function() {
            modal_container.classList.remove('show');
            console.log("close clicked!");
        }
        document.getElementById("modal-confirm").onmouseup = function() {
            // appModel.removeCurrentList();
            appModel.deleteListTransaction();
            modal_container.classList.remove('show');
            console.log("list deleted!");
        }
        document.getElementById("todo-lists-list").onclick = e => {

            // console.log('fix weird sidebar!');
            // console.log(e.target);
            if (!e.target.classList.contains('todo_butotn'))
                return

            let lists = document.getElementById("todo-lists-list").querySelectorAll('div');
            // console.log(lists);
            lists.forEach(function(list) {
                list.style.backgroundColor = '#353a44';
                list.style.color = '#e9edf0';
            });
            // console.log(e.target);
            let newCurrentList = e.target;
            let newCurrentListId = e.target.getAttribute("id").split('-')[2];
            // console.log(newCurrentListId);

            this.model.moveListToIndex0(newCurrentListId);
        }
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }
}