
(function (global) {
  System.date = new Date().getTime();
  System.config({
    paths: {
      // псевдоним для пути к модулям
      'npm:': 'node_modules/'
    },
    // указываем загрузчику System, где искать модули
    map: {
      // наше приложение будет находиться в папке app
      app: 'app',
      // пакеты angular
      '@angular/animations': 'npm:@angular/animations/bundles/animations.umd.js',
      '@angular/animations/browser': 'npm:@angular/animations/bundles/animations-browser.umd.js',
      '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
      '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
      '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
      '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
      '@angular/platform-browser/animations': 'npm:@angular/platform-browser/bundles/platform-browser-animations.umd.js',   
      '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
      '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
      '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
      '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
      // остальные пакеты
      'angular-in-memory-web-api': 'npm:angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
      'jquery': 'npm:jquery/dist/jquery.min.js',
      'ng2-page-scroll': 'npm:ng2-page-scroll/bundles/ng2-page-scroll.umd.js',
      'text-mask-core': 'npm:text-mask-core/',
      'angular2-text-mask': 'npm:angular2-text-mask/dist/angular2TextMask.js',
      'rxjs': 'npm:rxjs',
      'moment': 'npm:moment/min/moment-with-locales.min.js',
      'angular2-moment': 'npm:angular2-moment',
      'angular2-perfect-scrollbar': 'npm:angular2-perfect-scrollbar/bundles/angular2-perfect-scrollbar.umd.js',
      'slick-carousel': 'npm:slick-carousel/slick/slick.min.js',
    },
    // пакеты, которые указывают загрузчику System, как загружать файлы без имени и расширения
    packages: {
      app: {
        main: './main',
        defaultExtension: 'js?v=' + System.date
      },
      rxjs: {
        defaultExtension: 'js'
      },
      'text-mask-core': {
        defaultExtension: 'js'
      },
      'angular2-text-mask': {
        defaultExtension: 'js'
      },
      'angular2-moment': {
          main: './index.js',
          defaultExtension: 'js'
      }
    }
  });
})(this);