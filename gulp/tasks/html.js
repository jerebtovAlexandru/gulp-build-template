import fileInclude from "gulp-file-include";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";

export const html = () => {
  return app.gulp
    .src(app.path.src.html) // метод .src()  получает доступ к папкам по указанному пути.
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "HTML",
          message: "Error:<%=error.message %>"})),
    )
    .pipe(fileInclude())
    .pipe(app.plugins.replace(/@img\//g, "img/"))
    .pipe(webpHtmlNosvg())
    .pipe(
      versionNumber({
        value: "%DT%",
        append: {
          key: "_v",
          cover: 0,
          to: ["css", "js"],
        },
        output: {
          file: "gulp/version.json",
        },
      }),
    )
    .pipe(app.gulp.dest(app.path.build.html)) // метод .dest() указывает куда нам перенести файлы  || метод .pipe() обозначает передачу результатов работы одного шага на следующий шаг.
    .pipe(app.plugins.browsersync.stream()); // метод stream() для обновление страницы (перевод - поток ).
};
