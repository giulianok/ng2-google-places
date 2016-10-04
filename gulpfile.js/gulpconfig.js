const folder = {
	app: './src',
	public: './_public'
};

const configuration = {

	folder: folder,

	componentTemplates: {
		src: [
			`${folder.app}/components/**/*.jade`,
			`${folder.app}/modules/**/*.jade`
		],
		dest: `${folder.public}/templates`
	},

	templates: {
		src: `${folder.app}/*.jade`,
		dest: `${folder.public}`
	},

	clean: {
		public: `${folder.public}/templates`
	},

	/* Plugins */
	plugins: {
		pattern: [
			'gulp-*',
			'gulp.*',
			'path',
			'yargs'
		],
		lazy: false
	}

};


module.exports = configuration;