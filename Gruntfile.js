module.exports = function(grunt) {
	grunt.initConfig({
		execute: {
			target: {
				src: ['bin/www']
			}
		},
		watch: {
			scripts: {
				files: ['./**/*.js'],
				tasks: ['execute']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-execute');
};
