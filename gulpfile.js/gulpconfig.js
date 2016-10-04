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

	styles: {
		src: `${folder.app}/scss/*.scss`,
		listening: `${folder.app}/scss/**/*.scss`,
		dest: `${folder.public}/css`,
		inject: 'Changed on the bottom'
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

configuration.styles.inject = [
	folder.app + '/components/**/*.scss'
];


module.exports = configuration;