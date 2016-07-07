module.exports = function(grunt) {
  grunt.initConfig({
    themesPath: 'public/orderable/',
    sass: {
      dist: {
        files: {
          '<%= themesPath %>/css/style.css' : '<%= themesPath %>/src/scss/main.scss'
          },
          options: {
            style: 'compressed'
          }
      },
      dev: {
        files: {
          '<%= themesPath %>/css/style.css' : '<%= themesPath %>/src/scss/main.scss'
          },
          options: {
            style: 'expanded'
          }
      }
    },

    watch: {
      styles: {
        files: ['<%= themesPath %>/src/scss/*.scss'],
        tasks: ['sass:dist'],
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['watch']);
  grunt.registerTask('style',['sass']);
}