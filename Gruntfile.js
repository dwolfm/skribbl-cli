'use strict';

var workingFiles = ['lib/**/*.js', 'test/**/*.js', './*.js'];


module.exports = function(grunt){
	// load grunt-npm plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-simple-mocha');
	
	// configure grunt tasks
	grunt.initConfig({
		jshint: {
			dev: {
				src: workingFiles
			},
			options: {
				jshintrc: true
			}
		},
		simplemocha: {
			options: {
				globals: ['should'],
				timeout: 3000,
				ignoreLeaks: false,
				ul: 'bdd',
				reporter: 'tap'
			},
			dev: {
				src:['test/**/*_test.js']
			}
		},
		watch: {
			lint: {
				files: workingFiles,
				tasks: ['jshint:dev'],
				options: {
					spawn: false,
				}
			}
		}

	});	  
	// register grunt tasks
	grunt.registerTask('default', ['jshint:dev','simplemocha:dev']);

};
