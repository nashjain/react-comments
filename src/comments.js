//Comment Model
Comment = function (data) {
    this.id = data.id;
    this.user = data.user;
    this.msg = data.msg;
    this.updatedOn = typeof(data.updatedOn) === 'string' ? Date.parse(data.updatedOn) : data.updatedOn;
    this.private = data.private || false;
    this.likes = parseInt(data.likes || "0");
};

Comment.prototype.compareTo = function (other) {
    if (this.likes == other.likes)
        return this.updatedOn - other.updatedOn;
    return this.likes - other.likes;
};

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

var CommentComponent = React.createClass({
    getInitialState: function () {
        return {};
    },
    handleSubmit: function (e) {
        e.preventDefault();
        this.props.comment.likes++;
        this.setState({});
        this.props.rerender();
    },
    render: function () {
        return <div className="comment">
            <div className="comment-header">
                {this.props.comment.user}
                <form onSubmit={this.handleSubmit} className="likes">
                    <button>{this.props.comment.likes} Likes</button>
                </form>
            </div>
            <div className="comment-body">{this.props.comment.msg}</div>
        </div>;
    }
});

var MsgComponent = React.createClass({
    render: function () {
        return <div className="{this.props.className}">{this.props.msg}</div>;
    }
});

var CommentsComponent = React.createClass({
    getInitialState: function () {
        return {comments: new Comments([]), loggedInUser: '', ajax_error: false};
    },
    _setState: function (comments, loggedInUser, ajax_error) {
        if (this.isMounted()) {
            this.setState({comments: comments, loggedInUser: loggedInUser, ajax_error: ajax_error});
        }
    },
    componentDidMount: function () {
        var comments = this.state.comments;
        var loggedInUser = this.props.loggedInUser || this.state.loggedInUser;

        var component = this;

        if (component.props.comments) {
            comments = new Comments(component.props.comments);
            component._setState(comments, loggedInUser, false);
            return;
        }

        if (component.props.sourceUrl) {
            $.getJSON(component.props.sourceUrl)
                .done(function (data) {
                    component._setState(new Comments(data), loggedInUser, false);
                })
                .fail(function () {
                    component._setState(comments, loggedInUser, true);
                });
        }
    },
    render: function () {
        if (this.state.ajax_error)
            return <MsgComponent className={'error'} msg={'Failed to fetch comments from URL...'} key={'error'}/>;

        var comments = this.state.comments.authorised(this.state.loggedInUser).sort();
        if (comments.isEmpty())
            return <MsgComponent className={'empty'} msg={'Be the first one to comment...'} key={'empty'}/>;

        var container = this;
        var rerender = function () {
            container._setState(comments.sort(), container.state.loggedInUser, false);
        };
        var createComment = function (comment) {
            return <CommentComponent comment={comment} key={comment.id} rerender={rerender}/>;
        };
        return <div>{comments.map(createComment)}</div>;
    }
});

