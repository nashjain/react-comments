describe("Comments Plugin",function(){
    var comment_component;
    var TestUtils = React.addons.TestUtils;
    var singleCommentJSON;
    var getURL = 'http://localhost/react-comments/comments.php';

    beforeEach(function() {
        singleCommentJSON = {id:1, msg: "First Comment", user: "Naresh", updatedOn: "2014-09-19T15:28:46.493Z", likes:1};
    });

    it("Should give a nice message when there are no comments", function () {
        comment_component = TestUtils.renderIntoDocument(<CommentsComponent comments={[]} loggedInUser="Dhaval"/>);
        var comments = $(comment_component.getDOMNode());
        expect(comments).toContainText('Be the first one to comment...');
    });

    it("Should add single comment as a div from passed in json", function () {
        comment_component = TestUtils.renderIntoDocument(<CommentsComponent comments={[singleCommentJSON]} loggedInUser="Dhaval"/>);
        var comments = $(comment_component.getDOMNode());
        expect(comments).toContainElement('div.comment');
        expect(comments.find('div.comment').size()).toBe(1);
        expect(comments.find('div.comment div.comment-header')).toContainText('Naresh');
        expect(comments.find('div.comment div.comment-body')).toContainText('First Comment');
    });

    it("Should display the most recent comments on top", function () {
           var data= [singleCommentJSON,
                {id:2, msg: "Second Comment", user: "James", updatedOn: "2014-06-19T15:28:46.493Z", likes:1},
                {id:3, msg: "Third Comment", user: "Jack", updatedOn: "2014-12-19T15:28:46.493Z", likes:1}];
        comment_component = TestUtils.renderIntoDocument(<CommentsComponent comments={data} loggedInUser="Dhaval"/>);
        var comments = $(comment_component.getDOMNode());
        expect(comments.find('div.comment').size()).toBe(data.length);
        expect(comments.find('div.comment div.comment-header:first')).toContainText('Jack');
        expect(comments.find('div.comment div.comment-header:last')).toContainText('James');
    });

    it("Should not display private comments to guest user", function () {
        singleCommentJSON.private = true;
        comment_component = TestUtils.renderIntoDocument(<CommentsComponent comments={[singleCommentJSON]} loggedInUser="Dhaval"/>);
        var comments = $(comment_component.getDOMNode());
        expect(comments.find('div.comment').size()).toBe(0);
        expect(comments).toContainText('Be the first one to comment...');
    });

    it("Should not display private comments to public", function () {
        singleCommentJSON.private = true;
        comment_component = TestUtils.renderIntoDocument(<CommentsComponent comments={[singleCommentJSON]} loggedInUser="Dhaval"/>);
        var comments = $(comment_component.getDOMNode());
        expect(comments.find('div.comment').size()).toBe(0);
        expect(comments).toContainText('Be the first one to comment...');
    });

    it("Should display private comments to author", function () {
        singleCommentJSON.private = true;
        comment_component = TestUtils.renderIntoDocument(<CommentsComponent comments={[singleCommentJSON]} loggedInUser="Naresh"/>);
        var comments = $(comment_component.getDOMNode());
        expect(comments.find('div.comment').size()).toBe(1);
        expect(comments.find('div.comment div.comment-header')).toContainText('Naresh');
    });

    xit("Should fetch data from URL and display comments", function () {
        var expectedAjaxResponse = [
            singleCommentJSON,
            {id:2, msg: "Second Comment", user: "James", updatedOn: "2014-06-19T15:28:46.493Z"},
            {id:3, msg: "Third Comment", user: "Jack", updatedOn: "2014-12-19T15:28:46.493Z"}
        ];
        jasmine.Ajax.stubRequest(getURL).andReturn({
            status: 200,
            statusText: 'HTTP/1.1 200 OK',
            contentType: 'application/json;charset=UTF-8',
            responseText: JSON.stringify(expectedAjaxResponse)
        });

        comment_component = TestUtils.renderIntoDocument(<CommentsComponent sourceUrl={getURL} loggedInUser="Naresh"/>);
        var comments = $(comment_component.getDOMNode());

        expect(comments.find('div.comment').size()).toBe(expectedAjaxResponse.length);
        expect(comments.find('div.comment div.comment-header:first')).toContainText('Jack');
        expect(comments.find('div.comment div.comment-header:last')).toContainText('James');
    });

    xit("Should try to fetch data from URL and display error message when unsuccessful", function () {
        jasmine.Ajax.stubRequest(getURL).andReturn({
            status: 400,
            statusText: 'HTTP/1.1 400 Bad Request',
            contentType: 'application/json;charset=UTF-8',
            responseText: ''
        });

        comment_component = TestUtils.renderIntoDocument(<CommentsComponent sourceUrl={getURL} loggedInUser="Naresh"/>);
        var comments = $(comment_component.getDOMNode());

        expect($('div.comment').size()).toBe(0);
        expect(comments).toContainText('Failed to fetch comments from URL...');
    });
});
