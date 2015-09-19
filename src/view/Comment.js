var CommentComponent = React.createClass({
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
                    <button ref={this.props.comment.id}>{this.props.comment.likes} Likes</button>
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