 export const copy = () => {
  return app.gulp.src(app.path.src.files) // метод .src()  получает доступ к папкам по указанному пути.
    .pipe(app.gulp.dest(app.path.build.files)); // метод .dest() указывает куда нам перенести файлы  || метод .pipe() обозначает передачу результатов работы одного шага на следующий шаг.
}