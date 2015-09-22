//Comments Model
Comments = function (data) {
    this.data = data.map(function (elem) {
        return new Comment(elem);
    });
};

Comments.prototype.sort = function () {
    var sortedComments = this.data.sort(function (a, b) {
        return b.compareTo(a);
    });
    return new Comments(sortedComments);
};

Comments.prototype.authorised = function (loggedInUser) {
    var filteredComments = this.data.filter(function (c) {
        return loggedInUser === c.user || !c.private;
    });
    return new Comments(filteredComments);
};

Comments.prototype.isEmpty = function () {
    return this.data.length == 0;
};

Comments.prototype.map = function (cb) {
    return this.data.map(cb);
};