module.exports = (settings)->
	class Media
		constructor:(settings)->
			@media = settings.mongoose.model 'media'
			@helper = (require __dirname + '/../helper')()
			@settings = settings
	
		create:(resource)->
			promise = new @settings.Promise
			url = @helper.linkify(resource.slug)
			body = resource.body
			@media.findOne url:url, (err, data)=>
				if data is null
					db = @settings.mongoose.connection.db
					gridStore = new settings.GridStore(db, url, 'w')
					gridStore.open (err, gs)=>
						gs.write body, (err, gs)=>
							gs.close (err, result)=>
								GridStore.exist db, result._id, (err, result)=>
									console.log err
								if err isnt null 
									throw err
								media = new @media
									title:resource.slug
									id:resource.id
									url:url
									type:resource.type
									date:new Date()
								media.save (err, data)->
									promise.resolve(data)
				else
					promise.resolve(data)

			return promise
		
		get:(url)->
			promise = new @settings.Promise
			@media.findOne url:url, (err, result)=>
				if result isnt null
					db = @settings.mongoose.connection.db
					gridStore = new @settings.GridStore(db, result.url, 'r')
					gridStore.open (err, gs)->
						if typeof gs isnt 'undefined'
							gs.seek 0, ()->
								gs.read (err, data)->
									gs.close (err, result)=>
										promise.resolve
											type : result.type
											data : data
						else
							promise.resolve null
				else
					promise.resolve null

			return promise
			
		remove:(url, callback)->
			@media.remove url:url ,()=>
				db = @settings.mongoose.connection.db
				gridStore = new @settings.GridStore(db, url, 'r')
				gridStore.open (err, gs)=>
					if typeof gs isnt 'undefined'
						gs.unlink (err, result)=>
							if err != null
								throw err
							callback()
					else
						callback()
						
		clear:(callback)=>
			@media.find (err, data)=>
				count = 1
				for media in data
					@.remove media.url, ()->
						if (count == data.length)
							callback()
						count++

					
	new Media(settings)