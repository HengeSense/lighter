module.exports = (settings)->
	class Blog
		constructor: (settings) ->
			@settings = settings
			@blog = settings.mongoose.model 'blog'
			@post = settings.mongoose.model 'post'
			@helper = (require __dirname + '/helper')()

		create: (obj, callback) ->		
			@blog.findOne url : @settings.url, (err, data)=>
				# format
				for post in obj.posts
					post.title = post.title.trim()
			
				if data isnt null
					@_post
						id 		: data._id
						posts	: obj.posts
						, (data)->
								callback(data)
								return
				else
					blog = new @blog
						url		: @settings.url
						title	: @settings.title
						updated : @settings.updated
					blog.save (err, data) =>
							if err == null
								@_post
									id : data._id
									posts: obj.posts
									, (data)->
											callback(data)
											return
		find:(callback, format)->
			@blog.findOne url : @settings.url, (err, data) =>
				if err!= null
					throw err.message
				blog = data
				@post.find({id : blog._id}).sort({date: -1}).exec (err, data)=>
					posts = []
					for post in data
						if (format)
							post.body = settings.format(post.body)
						posts.push post
					callback({
						id 		: blog._id
						url 	: blog.url 
						title : blog.title
						updated : blog.updated
						posts :	posts
					})
				return
				
		findMostRecent: (callback) ->
			@blog.findOne url: @settings.url, (err, data) =>
				@post.find({id : data._id}).sort({date: -1}).limit(5).exec (err, data)=>
						recent = []
						for post in data
								recent.push({
									title 		: post.title
									permaLink :	post.permaLink
								})
						callback(recent)
				return
				
		findPost: (permaLink, callback, format)->
			@blog.findOne url: @settings.url, (err, data) =>
				@post.findOne 
					id : data._id 
					permaLink: permaLink,(err, data)=>
						if (format)
							data.body = @settings.format(data.body)
						callback(data)
				return
				
		findPostById: (id, callback)->
			@post.findOne 
				_id : id, (err, data)=>
					callback(data)
	
		delete: () ->
			@blog.find url : @settings.url, (err, data) =>
				for blog in data
					@post.remove id : blog._id, ()=>
						@blog.remove url : @settings.url

		_post: (obj, callback) ->
			for post in obj.posts
				link =  @helper.linkify(post.title)
				postSchema = new @post
						id 				: obj.id
						title 		: post.title
						permaLink	:	link
						author 		:	post.author
						body 			: post.body
						publish : 1
						date			:	new Date()		
				postSchema.save (err, data) ->
					if err != null
							callback(err.message)
						callback(data)
						return
																	
	new Blog settings