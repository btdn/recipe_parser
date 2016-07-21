(function() {

    var ProgressModel = {};
    var INPUT_URL = 'recipes';
    var PROGRESS_URL = 'get_recipes';
    var STATUS_OK = 200;

    ProgressModel.getCurr = function(callback) {
        var request = new XMLHttpRequest();
        request.addEventListener('load', function(error) {
            if (request.status === STATUS_OK) {
                var json = JSON.parse(request.responseText);
                if(json['percent_complete'] >= 1.0) {
                    callback(null, json);
                    return;
                } else {
                    console.log("not complete yet");
                    setTimeout(ProgressModel.getCurr(callback), 1000);
                }
            } else {
                callback("error", request.responseText);
            }
        });
        request.open('GET', PROGRESS_URL);
        request.send();
    };

    ProgressModel.startLoad = function(callback) {
        var request = new XMLHttpRequest();
        request.addEventListener('load', function(error) {
            if (request.status === STATUS_OK) {
                setTimeout(ProgressModel.getCurr(callback), 1000);
            } else {
                callback("error", request.responseText);
            }
        });
        request.open('GET', INPUT_URL);
        request.send();
    };

    window.ProgressModel = ProgressModel;
})();