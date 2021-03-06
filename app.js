var bodyParser 		= require ("body-parser"),
	methodOverride 	= require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose 		= require ("mongoose"),
	express			= require ("express"),
	app     		= express();
	
	
	

// Connect Mongoose to our database
// TA updated syntax on mongoose.connect
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer())
app.use(methodOverride("_method"));

// Schema Model Config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
})

// Compile into model
var Blog = mongoose.model("Blog", blogSchema);

// RESTful Routes
app.get("/", function(req, res){
	res.redirect("/blogs");
})

// Index route
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("Error");
		} else {
			res.render("index", {blogs: blogs});
		}
	})
})

// New Route
app.get("/blogs/new", function(req, res){
	res.render("new");
})

// CREATE Route
app.post("/blogs", function(req, res){
// 	create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			// 	then redirect to index
			res.redirect("/blogs");
		}
	})
})

// SHOW Route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog})
		}
	});
})

// EDIT Route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		} else {
			res.render("edit", {blog: foundBlog});
		}
	})
})

//UPDATE route
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	})
})

// DELETE route
app.delete("/blogs/:id", function(req, res){
// 	delete blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs")
		} else {
			res.redirect("/blogs")
		}
	})
// 	redirect somewhere
})

// Tell Express to listen for requests (start server)
app.listen(3000, function() { 
  console.log('Yo dog, restful server has started'); 
});
