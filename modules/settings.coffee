module.exports = (app)->
	class Settings
		constructor:(app) ->
			@mongoose = require('mongoose')  
			# init mongo        
			url = process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/lighter'
			@mongoose.connect url
			@marked = require('marked')			
			@marked.setOptions
				highlight:(code,lang) ->
					hl = require('highlight.js')
					hl.tabReplace = '    '
					(hl.highlightAuto code).value
					
		marked		:	@marked
		mongoose	:	@mongoose
		url				:	()=> 'http://lighter-engine.herokuapp.com/'
		title			:	process.env.BLOG_TITLE || 'Mehfuz\'s Blog'
		username	:	process.env.USERNAME || 'admin'
		password	:	process.env.PASSWORD || 'admin'
		updated		:	new Date()
		engine		:	'Lighter Blog Engine'
		format: (content) ->
			@marked(content)
						
	new Settings()
	