/**
 * Created by Boaz on 23/02/2017.
 */

    function MyHistory() {
        this._historyForGoingBack = [];
        this._historyForGoingForward = [];
    }

    MyHistory.prototype.addToHistory = function (id) {
        this._historyForGoingBack.push(id);
    };

    MyHistory.prototype.getLastIdInHistory = function () {
        var targetId = this._historyForGoingBack.pop();
        return targetId;
    };




