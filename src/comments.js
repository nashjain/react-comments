//Comment Model
Comment = function (data) {
    this.id = data.id;
    this.user = data.user;
    this.msg = data.msg;
    this.updatedOn = Date.parse(data.updatedOn);
    this.private = data.private || false;
};

Comment.prototype.compareTo = function (other) {
    return this.updatedOn - other.updatedOn;
};

//Comments Model
Comments = function (data) {
    this.data = data.map(function (elem) {
        return new Comment(elem);
    }).sort(function (a, b) {
        return b.compareTo(a);
    });
};

Comments.prototype.authorised = function (loggedInUser) {
    return this.data.filter(function (c) {
        return loggedInUser === c.user || !c.private;
    });
};

var CommentComponent = React.createClass({
    render: function () {
        return <div className="comment">
            <div className="comment-header">{this.props.comment.user}</div>
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

        var comments = this.state.comments.authorised(this.state.loggedInUser);
        if (comments.length == 0)
            return <MsgComponent className={'empty'} msg={'Be the first one to comment...'} key={'empty'}/>;

        var createComment = function (comment) {
            return <CommentComponent comment={comment} key={comment.id}/>;
        };
        return <div>{comments.map(createComment)}</div>;
    }
});

