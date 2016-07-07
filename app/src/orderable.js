
var SortableItem = React.createClass({

  deletePost: function(e) {
    e.preventDefault();
    this.props.deletePost( this.props.id );
  },

  editPost: function(e) {
    e.preventDefault();
    this.props.editPost( this.props.id );
  },

	render: function() {
		return (
			<div data-id={this.props.id} className="orderableBox">				  
        <div className="orderableInner">

          <div className="orderableActions">
            <span className="pull-right" onClick={this.deletePost} >delete</span>
            <span className="pull-right" onClick={this.editPost} >edit</span>
            <div className="clearfix"></div>
          </div>
          <small>Epic Title</small>
	        <p>{this.props.title}</p>
          <small>Epic description</small>
	        <p>{this.props.text}</p> 

	    	</div>
    	</div>
		);
	}

});

var SortableList = React.createClass({

  deletePost: function( post_id ) {
    this.props.deletePost( post_id );
  },

  editPost: function( post_id ){
    this.props.editPost( post_id );
  },

	sortedItems: function( start = 0, limit ) {
    var items = _.sortBy(this.props.items, 'order');

    var data = items.slice( start, limit );

    return data.map((item) => { 
      return (
        <SortableItem key={item.id} id={item.id} position={item.order} text={item.content} title={item.title} deletePost={this.deletePost} editPost={this.editPost} />
      )
    })
  },

  openAddPostForm: function(e) {
    e.preventDefault();

    $('.addPostForm').fadeIn();
    $('.bg-overlay').fadeIn();
  },

  topPriorityEpics: function(){
    var items = this.props.items;
    if( items.length > 0 ){
      return(
        <div className="topPriorityEpics">
          <h5 className="heading5">Top priority epics</h5>
          <div className="priority-high">
            {this.sortedItems(0,3)}
          </div>
        </div>
      );
    }else{
      return(        
        <div className="topPriorityEpics">
          <h5 className="heading5">Top priority epics</h5>
          <div className="priority-high">
            <div className="no-content">
              <p>You currently have not submitted any epics</p>
              <p>Please start adding new epics to your backlog. Go mad, dream big!</p>
              <a className="button medium-button addNewButton" href="#" onClick={this.openAddPostForm}>Add new epic</a>
            </div>
          </div>
        </div>
      );
    }
  },

  secondaryEpics: function(){
    return(
      <div className="secondaryEpics">
        <h5 className="heading5">Secondary epics</h5>
        <div className="priority-normal">
          {this.sortedItems(3)}
        </div>
      </div>
    );
  },

	render: function() {
		return (
    	<div id="orderableWrapper" ref="orderableWrapper" className="ui-sortable-disabled">
        {this.topPriorityEpics()}
        {this.secondaryEpics()}        
    	</div>
    );
	}

});

var SortableControlls = React.createClass({

	update: function(e) {
		e.preventDefault();
    var disabled = this.props.update();
    if(disabled){
    	$(this.refs.orderableButton).html('Reorder');
    	$(this.refs.cancelButton).hide();
      //Perform Save
      this.props.updateOrder();
    }else{
    	$(this.refs.orderableButton).html('Save Order');
    	$(this.refs.cancelButton).show();
    }
  },

  cancel: function(e) {
  	e.preventDefault();

  	this.props.cancel();
  	$(this.refs.orderableButton).html('Reorder');
  	$(this.refs.cancelButton).hide();
  },

  openAddPostForm: function(e) {
    e.preventDefault();

    $('.addPostForm').fadeIn();
    $('.bg-overlay').fadeIn();
  },

	render: function() {
		return(
			<div id="orderableControlls">
        <a className="button medium-button addNewButton" href="#" onClick={this.openAddPostForm} >Add new epic</a>
        <div className="epicCount"><span className="countBox">{this.props.postCount}</span>My Epics</div>        
        <span className="pull-right order-links">
				  <a href="#" onClick={this.update} ref="orderableButton">Reorder</a>
				  <a href="#" onClick={this.cancel} ref="cancelButton" style={{display: 'none'}}>Cancel</a>
        </span>        
			</div>
		);
	}

});

var AddSortableForm = React.createClass({

  getInitialState: function() {
    return {title: '', content: '', order: '', author: ''};
  },

  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },

  handleContentChange: function(e) {
    this.setState({content: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();

    var posts = _.sortBy(this.props.items, 'order');
    if( posts.length > 0 ){
      var order = posts[posts.length-1].order + 1;
    }else{
      var order = 0;
    }
    

    var title = this.state.title.trim();
    var content = this.state.content.trim();
    var author = this.state.author.trim();

    if( !title )
      return;

    this.props.onPostSubmit({title: title, content: content, order: order, author: author});
    this.setState({title: '', content: '', order: '', author: ''});
  }, 

  closePostForm: function(e){
    e.preventDefault();
    $('.addPostForm').fadeOut();
    $('.bg-overlay').fadeOut();
    this.setState({title: ''});
    this.setState({content: ''});
  },

  render: function() {
    return (
      <form className="addPostForm modal" onSubmit={this.handleSubmit}>
        <div className="close" onClick={this.closePostForm} >X</div>
        <h3>Submit an epic</h3>
        <p>Fill in the details below and click “add epic” to submit</p>
        <label for="epicTitle">Epic title</label>
        <input
          type="text"
          placeholder=""
          className="epicField"
          id="epicTitle"
          value={this.state.title}
          onChange={this.handleTitleChange}
        />
        <br />
        <label for="epicContent">Epic description</label>
        <textarea onChange={this.handleContentChange} placeholder="" className="epicField" id="epicContent" value={this.state.content} rows="10" cols="50" />
        <br />
        <input type="hidden" name="formAction" id="formAction" value="add" />
        <input type="submit" className="button large-button" value="Submit" />
      </form>
    );
  }

});

var EditSortableForm = React.createClass({

  getInitialState: function() {
    return {id: '', title: '', content: '', author: ''};
  },

  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },

  handleContentChange: function(e) {
    this.setState({content: e.target.value});
  },

  handleSubmit: function(e){
    e.preventDefault();

    var editing = this.props.editing;

    var posts = _.sortBy(this.props.items, 'order');
    var single = posts.filter(function(value){
      if( value.id == editing ){
        return value;
      }
    });

    var order = single[0].order;
    var title = $('.editPostForm #epicTitle').val();
    var content =$('.editPostForm #epicContent').val();
    var author = this.state.author.trim();

    if( !title )
      return;

    this.props.onPostSubmit({id: editing, title: title, content: content, order: order, author: author});
    this.setState({id: '', title: '', content: '', order: '', author: ''});
  },

  closePostForm: function(e){
    e.preventDefault();
    $('.editPostForm').fadeOut();
    $('.bg-overlay').fadeOut();
    this.setState({title: ''});
    this.setState({content: ''});
    this.setState({id: ''});
  },

  render: function() {
    var posts = this.props.items;
    var editing = this.props.editing;    

    var single = posts.filter(function(value){
      if( value.id == editing ){
        return value;
      }
    });

    return (
      <form className="editPostForm modal" onSubmit={this.handleSubmit}>
        <div className="close" onClick={this.closePostForm} >X</div>
        <h3>Edit epic</h3>
        <p>You can edit the content of this epic below</p>

        <input type="hidden" id="epicID" name="epicID" value={editing} />

        <label for="epicTitle">Epic title</label>        
        <input onChange={this.handleTitleChange} type="text" placeholder="" className="epicField" id="epicTitle" value={single.title} />
        <br />
        <label for="epicContent">Epic description</label>
        <textarea onChange={this.handleContentChange} placeholder="" className="epicField" id="epicContent" rows="10" cols="50" value={single.content} />
        <br />
        <input type="hidden" name="formAction" id="formAction" value="edit" />
        <input type="submit" className="button large-button" value="Submit" />
      </form>
    );
  }

});

var SortableWidget = React.createClass({

	getInitialState: function() {
    return {
      disabled: true,
      items: [],
      tempItems: [],
      editing: ''
    };
  },

  componentDidMount: function() {
  	this.loadDataFromServer();   

    $(this.refs.sortableWidget).find('#orderableWrapper').sortable({
      items: '.orderableBox',
      update: this.handleSortableUpdate,
      placeholder: 'sortable-placeholder',
      //handle: '.handle',
      disabled: true
    });
  },

  loadDataFromServer: function() {
    $.ajax({
      url: "/api/posts",
      cache: false,
      success: function(data) {
        this.setState({items: data});
      }.bind(this),
      error: function(xhr, status, err) {

        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  savePostOrder: function() {
    var posts = _.sortBy(this.state.items, 'order');    
    var data = {};

    posts.forEach( function(post, i){
      data[i] = post;
    });

    data.length = posts.length;

    $.ajax({
      url: "/api/posts/order",
      dataType: 'json',
      type: 'POST',
      data: data,
      success: function(data) {

      }.bind(this),
      error: function(xhr, status, err) {

        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });   

  },

  handlePostSubmit: function(post) {
    var posts = this.state.items;

    //Temporary ID
    post.id = Date.now();

    //Presume success and add in temporay post
    var newPosts = posts.concat([post]);
    this.setState({items: newPosts});

    $.ajax({
      url: '/api/posts/add',
      dataType: 'json',
      type: 'POST',
      data: post,
      success: function(data) {
        //Update the state with the new id
        post.id = data.insertId;
        newPosts = posts.concat([post]);
        this.setState({items: newPosts});
        this.hideAllModals();
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({items: posts});
        console.error(this.props.url, status, err.toString());

      }.bind(this)
    });  

  },

  handlePostUpdate: function(post){
    //This is where the ajax stuff will be
    var posts = this.state.items;

    var oldPosts = posts.filter(function(value){
      if( value.id != post.id ){
        return value;
      }
    });

    $.ajax({
      url: '/api/posts/update',
      dataType: 'json',
      type: 'POST',
      data: post,
      success: function(data) {
        var newPosts = oldPosts.concat([post]);
        this.setState({items: newPosts});
        this.hideAllModals();
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({items: posts});
        console.error(this.props.url, status, err.toString());

      }.bind(this)
    });

  },

  handleSortableUpdate: function() {
    var newItems = _.clone(this.state.items, true);
    var $node = $(this.refs.sortableWidget).find('#orderableWrapper');
    var ids = $node.sortable('toArray', { attribute: 'data-id' });     

    ids.forEach((id, index) => {
      var item = _.find(newItems, {id: Number(id)});      
      item.order = index;
    });

    // Lets React reorder the DOM
   	$node.sortable('cancel');
    
    this.setState({ items: newItems });
  },

  updateState: function() {
  	//Flip the value
  	var dis = ( this.state.disabled )? false : true;
  	this.setState({ disabled: dis });

  	var $node = $(this.refs.sortableWidget).find('#orderableWrapper');
  	$node.sortable({
      disabled: dis
    });

    if( !dis ){
    	var items = _.clone(this.state.items, true);
    	this.setState({ tempItems: items });
    }   

    return dis;
  },

  cancelUpdate: function() {
  	this.setState({ disabled: true });

  	var $node = $(this.refs.sortableWidget).find('#orderableWrapper');
  	$node.sortable({
      disabled: true
    });

    var tempItems = this.state.tempItems;
    this.setState({ items: tempItems });
  }, 

  hideAllModals: function(e) {
    //e.preventDefault();
    $('.bg-overlay').fadeOut();
    $('.modal').fadeOut();
  },

  deletePostModal: function( post_id ){
    var result = confirm("Are you sure you wish to delete this epic?");
    if (result) {
      this.deletePost( post_id );
    }
  },

  deletePost: function( post_id ){
    var posts = this.state.items;
    var newPosts = posts.filter(function(value){
      if( value.id != post_id ){
        return value;
      }
    });
    var removePost = posts.filter(function(value){
      if( value.id == post_id ){
        return value;
      }
    });

    this.setState({items: newPosts});

    if( post_id ){
      $.ajax({
        url: '/api/posts/delete',
        dataType: 'json',
        type: 'POST',
        data: removePost[0],
        success: function(data) {
          //Update the state with the new id
          this.setState({items: newPosts});
        }.bind(this),
        error: function(xhr, status, err) {
          this.setState({items: posts});
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }    
  },

  editPost: function( post_id ){
    //Tiggered upon clicking posts edit button
    var posts = this.state.items;
    var single = posts.filter(function(value){
      if( value.id == post_id ){
        return value;
      }
    });

    this.setState({editing: post_id});

    $('.editPostForm #epicID').val( post_id );
    $('.editPostForm #epicTitle').val( single[0].title );
    $('.editPostForm #epicContent').html( single[0].content );

    $('.bg-overlay').fadeIn();
    $('.editPostForm').fadeIn();

  },
	
	render: function() {
		return (
			<div id="sortableWidget" ref="sortableWidget" >
    		<SortableControlls update={this.updateState} updateOrder={this.savePostOrder} cancel={this.cancelUpdate} postCount={this.state.items.length} />
    		<SortableList items={this.state.items} deletePost={this.deletePostModal} editPost={this.editPost} />

        <AddSortableForm items={this.state.items} onPostSubmit={this.handlePostSubmit} />
        <EditSortableForm items={this.state.items} editing={this.state.editing} onPostSubmit={this.handlePostUpdate} />        
        <div className="bg-overlay" onClick={this.hideAllModals} ></div>
    	</div>
    );
	}

});


ReactDOM.render(
	<SortableWidget />, 
	document.getElementById('content') 
);