module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodewebkit: {
            options: {
                version: '0.12.0',
                build_dir: './dist',
                // choose what platforms to compile for here
                mac: true,
                win: false,
                linux32: false,
                linux64: false
            },
            src: ['./app/**/*']
        }
    })

    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.registerTask('default', ['nodewebkit']);
};
