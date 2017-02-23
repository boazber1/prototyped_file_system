/**
 * Created by Boaz on 22/02/2017.
 */

function File(id, name, type, content, parentId) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._content = content;
    this._parentId = parentId;
    this._children = [];
}

File.prototype.rename = function(name){//
    this._name = name;
};

File.prototype.getType = function(type){
    if (this._type === type){
        return true;
    }
    return false;
};

File.prototype.setContent = function (content) {
    this._content = content;
};