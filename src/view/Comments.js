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
            aja()
                .url(component.props.sourceUrl)
                .on('success', function(response){
                    component._setState(new Comments(response), loggedInUser, false);
                })
                .on('40*', function(response){
                    component._setState(comments, loggedInUser, true);
                })
                .on('500', function(response){
                    component._setState(comments, loggedInUser, true);
                })
                .go();
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

