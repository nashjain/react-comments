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
                .done(function(response){
                    component._setState(new Comments(response), loggedInUser, false);
                })
                .fail(function(response){
                    component._setState(comments, loggedInUser, true);
                });
        }
    },
    render: function () {
        if (this.state.ajax_error)
            return <MsgComponent className='error' msg={'Failed to fetch comments from URL...'} key='error'/>;

        var comments = this.state.comments.authorised(this.state.loggedInUser).sort();
        if (comments.isEmpty())
            return <MsgComponent className='empty' msg={'Be the first one to comment...'} key='empty'/>;

        var container = this;
        var rerenderComments = function (id) {
            comments.updateLikeFor(id);
            container._setState(comments.sort(), container.state.loggedInUser, false);
        };
        var createComment = function (comment) {
            return <CommentComponent comment={comment} key={comment.id} updateLikes={rerenderComments}/>;
        };
        return <div>{comments.map(createComment)}</div>;
    }
});

