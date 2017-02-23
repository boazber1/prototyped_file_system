/**
 * Created by Boaz on 22/02/2017.
 */
"use strict";

/*global Variables */
var fileSystem;
var targetId = -1;
var currentLocationId = -1;
var editFileWindow = $('#text-file-container').clone();
var myHistoryNavigation = new MyHistory();

$(document).ready(function () {
    // createFileSystem();
    createSystem();
    initBrowser();
    initContextMenu();
    goBack();
    $('#text-file-container').remove;

});

/* Browser Functions */
function initBrowser() {
    var rootUl = createNewUlWithId(0, fileSystem.getItem(0)._name);
    $('#browser_ul').append(rootUl);

}

function openBrowserDirectory(folderId) {
    $('#img_'+folderId).attr('src', 'open.png');
    var directory = fileSystem.getItem(folderId);
    for (var i = 0; i < directory._children.length; i++){
        var currentChild = directory._children[i];
        if (currentChild.getType('directory')){
            appendNewUl(folderId, currentChild._id, currentChild._name);
        }
    }
}

function closeBrowserDirectory(folderId) {
    $('#img_'+folderId).attr('src', 'close.png');
    var directory = fileSystem.getItem(folderId);
    for (var i = 0; i < directory._children.length; i++){
        if (directory._children[i].getType('directory')) {
            $('#browser_ul_' + directory._children[i]._id).remove();
        }
    }
}

function appendNewUl(parentId, childId, childName) {
    $('#browser_ul_'+parentId).append(createNewUlWithId(childId, childName));
}

function createNewUlWithId(id, name) {
    var newUl = $('<li><ul class="b_ul" id="browser_ul_'+id+'">' +
        '<img class ="dir" src="close.png" id="img_'+id+'" index="'+id+'">' +
        '<a href="#" id="a_'+id+'" index="'+id+'">'+name+'</a></ul></li>');
    addListenerClickToATitle(newUl.find('a'));
    addListenerRightClickToOpenContextMenuWithTargetId(newUl.find('a'));
    addListenerClickToFolderIcon(newUl.find('img'));
    return newUl;
}


/* Content Function */

function drawContent(folderId){
    $('#content').empty();
    currentLocationId = folderId;
    var directory = fileSystem.getItem(folderId);
    for (var i = 0; i < directory._children.length; i++){
            var currentChild = directory._children[i];
            drawFileOnContent(currentChild);
    }
    updateCurrentRootAddress(folderId)
}


function drawFileOnContent(file) {
    var imgSrc ='';
    switch(file._type){
        case 'directory':
            imgSrc = 'close.png';
            break;

        case 'file':
            imgSrc = 'text.png';
            break;
    }
    var newFile = $('<span><img class="content_icon" src="'+imgSrc+'" index="'+file._id+'">' +
        '<span class="content_file_text">'+file._name+'</span></span>');

    addListenerDblClickToContentFileIcon(newFile.find('img'));
    addListenerRightClickUpdateTargetId(newFile.find('img'));
    $('#content').append(newFile);
}



function initContextMenu() {
    $(document).contextmenu(function () {
        return false;
    });


    $('#content').mousedown(function () {
        if (event.button !== 2) {
            targetId = -1;
            $('#context_menu').fadeOut(200);
        }


    });

    $('#browser').mousedown(function () {
        if (event.button !== 2) {
            targetId = -1;
            $('#context_menu').fadeOut(200);
        }


    });



    addListenerRightClickToOpenContextMenu($('#content'));
    addListenerClickToCreateFolder();
    addListenerClickToCreateFile();
    addListenerClickToRename();
    addListenerClickToDelete();
    addListenerClickToGoToButton();
}


function openContextMenu(posX, posY) {
    if (targetId > -1){
        var contextMenu = $('#context_menu');
        contextMenu.css('top', posY+5);
        contextMenu.css('left', posX+5);
        $('.table_div').append(contextMenu);
        contextMenu.fadeIn(200);
    }
}



/* Listeners: */
function addListenerClickToFolderIcon(icon) {
    icon.click(function () {
        if ($(this).attr('src') === 'close.png'){
            openBrowserDirectory(parseInt($(this).attr("index")));
        } else {
            closeBrowserDirectory(parseInt($(this).attr("index")));
        }
    });
}

function addListenerClickToATitle(aTitle) {
    aTitle.click(function () {
        drawContent(parseInt($(this).attr("index")));
    });
}

function addListenerDblClickToContentFileIcon(icon) {
    icon.css({'cursor' : 'pointer'});
    if (icon.attr("src") === 'close.png'){
        icon.click(function () {
            drawContent(parseInt($(this).attr("index")));
            myHistoryNavigation.addToHistory(parseInt($(this).attr("index")));;
        });
    } else if(icon.attr('src') === 'text.png') {
        icon.click(function () {
            drawingTheContentFileWithADiv(parseInt($(this).attr('index')));
        })
    }
}


function addListenerRightClickToOpenContextMenu(item) {
    item.mousedown(function (event) {
        if (event.button === 2) {
            if (targetId === -1) {
                targetId = currentLocationId;

            }
            openContextMenu(event.pageX, event.pageY);
        }
    });
}

function addListenerRightClickToOpenContextMenuWithTargetId(item) {
    item.mousedown(function (event) {
        if (event.button === 2) {
            targetId = parseInt($(this).attr("index"));
            openContextMenu(event.pageX, event.pageY);

        }
    });
}

function addListenerRightClickUpdateTargetId(icon) {
    icon.mousedown(function () {
            if (event.button === 2) {
                targetId = parseInt($(this).attr("index"));
            }
        }
    )
}

function addListenerClickToGoToButton() {
    $('#go-to-address').click(function () {
        var searchPath = $('#root-address').val();
        searchPath = searchPath.split('\\');
        if(searchPath[0] !== 'ROOT'){
            alert('No such address called:' + searchPath);
        }

        var currentFolderId = 0;
        var flag = true;
        var index = 1;

        while(flag && index < searchPath.length  ){
            var file = fileSystem.getItem(currentFolderId);
            if(fileSystem.isFileNameExist(currentFolderId, searchPath[index], 'directory')){
                for(var i = 0; i < file._children.length; i++){
                    if(file._children[i]._name === searchPath[index] ){
                        currentFolderId = file._children[i]._id;
                    }
                }
            } else {
                alert('no path called ' + ($('#root-address').val()));
                flag = false;
            }
            index++
        }
        drawContent(currentFolderId);
    });
}



/*  ID = targetID   */
function addListenerClickToCreateFolder() {
    $('#create_directory').click(function () {
        var folderName = prompt("folder name:");
        if (folderName === ''){
            folderName = "new folder";
        }
        if (folderName !== null){
            folderName = fileSystem.getUnduplicatedFileName(targetId, folderName, 'directory');
            fileSystem.addFolder(folderName, targetId);
            drawContent(targetId);
            if($('#img_'+targetId).attr('src') === 'close.png' ){
                openBrowserDirectory(targetId);
            } else {
                appendNewUl(targetId, fileSystem.getLastId(),folderName);
            }
            fileSystem.savingToLocalStorage();
        }
    });

}

function addListenerClickToCreateFile() {
    $('#create_file').click(function () {
        var fileName = prompt('file Name:');
        if (fileName === ''){
            fileName = 'new file';
        }
        if(fileName !== null){
            fileName = fileSystem.getUnduplicatedFileName(targetId, fileName, 'file');
            fileSystem.addFile(fileName, targetId, '');
            drawContent(targetId);
        }
        fileSystem.savingToLocalStorage();
    });
}

function addListenerClickToRename() {
    $('#rename_file').click(function () {

        $('#context_menu').fadeOut(200);
        var newName = prompt('Rename');
        var targetFile = fileSystem.getItem(targetId);
        var theParent = fileSystem.findParent(targetId);
        if(newName !== targetFile._name){
            closeBrowserDirectory(theParent._id);
            targetFile._name = newName;
            openBrowserDirectory(theParent._id);
            if(currentLocationId == theParent._id){
                drawContent(theParent._id);
            }


        } else {
            alert('name already exists')
        }
        targetId = -1;
        fileSystem.savingToLocalStorage();

    });



}

function addListenerClickToDelete() {
    $('#delete_file').click(function () {
        $('#context_menu').fadeOut(200);

        var theParent = fileSystem.findParent(targetId);
        closeBrowserDirectory(theParent._id);
        theParent.deleteChild(targetId);
        fileSystem.deleteItem(targetId);
        openBrowserDirectory(theParent._id);

        drawContent(theParent._id);
        fileSystem.savingToLocalStorage();
        targetId = -1;
    });
}



function updateCurrentRootAddress(fileId){
    var folderNameArr = [];
    var folderName = '';
    var address = '';
    while (fileId > -1 ){
        var file = fileSystem.getItem(fileId);
        folderNameArr.push(file._name);
        fileId = file._parentId;
    }

    while (folderNameArr.length > 0){
        folderName = folderNameArr.pop();
        folderName +='\\';
        address += folderName;

    }
    address = address.substring(0, address.length-1);
    $('#root-address').val(address);
}

// function createFileSystem() {
//     fileSystem = new FileSystem('ROOT');
//     fileSystem.addFolder('sub1', 0);
//     fileSystem.addFile('file1', 0, 'some text');
//     fileSystem.addFolder('sub2', 1);
//     fileSystem.addFolder('sub3', 0);
// }


function createSystem(){
    var system = JSON.parse(localStorage.getItem('FileSystem'));
    fileSystem = new Filesystem('ROOT');
    if(system !== null){
        drawingTheSavedSystem(system);
    }
}

function drawingTheSavedSystem(system){
    for(var i = 1; i < system.length; i++){
        if(system[i][2] ==="directory"){
            fileSystem.addFolder(system[i][1],system[i][3])
        }
        if(system[i][2] === "file"){
            fileSystem.addFile(system[i][1],system[i][3],system[i][4])
        }
    }
}

function drawingTheContentFileWithADiv(fileId) {
    var newEditFileWindow = editFileWindow.clone();
    $('#content').append(newEditFileWindow);
    newEditFileWindow.show();
    var targetFile = fileSystem.getItem(fileId);
    $('#file-text').val(targetFile._content);
    $('#save').click(function () {
        var targetFile = fileSystem.getItem(fileId);
        targetFile.setContent($('#file-text').val());
        newEditFileWindow.remove();
        fileSystem.savingToLocalStorage();
    })
    $('#exit').click(function () {
        newEditFileWindow.remove();
    })
}


function goBack() {
    $('#back').click(function () {
        if (myHistoryNavigation._historyForGoingBack.length > 0) {
            var folderHistoryToGoBack = myHistoryNavigation.getLastIdInHistory();
            myHistoryNavigation._historyForGoingForward.push(folderHistoryToGoBack);
            drawContent(folderHistoryToGoBack);
        } else {
            drawContent(0);
        }
    });

    $('#forward').click(function () {
        if (myHistoryNavigation._historyForGoingForward.length > 0) {
            var folderInHistoryToGoForward2 = myHistoryNavigation._historyForGoingForward.pop();
            myHistoryNavigation.addToHistory(folderInHistoryToGoForward2);
            drawContent(folderInHistoryToGoForward2);
        }
    })
}



