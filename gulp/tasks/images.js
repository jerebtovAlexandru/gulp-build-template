// Импорт плагина для конвертации растровых изображений в современный формат WebP
import webp from "gulp-webp";
// Импорт плагина для сжатия и оптимизации картинок без потери качества
import imagemin from "gulp-imagemin";
// Импорт мощного плагина на базе движка Sharp для адаптивного изменения размеров изображений
import sharpResponsive from "gulp-sharp-responsive";

// Опция кодирования (encoding: false) необходима в Gulp 5 для корректной передачи бинарных данных (картинок) через поток без повреждений
const options = { encoding: false };

// 1. Вспомогательная функция для создания WebP версий ваших картинок
const makeWebp = () => {
  // Возврат потока для контроля завершения подзадачи
  return (
    app.gulp
      // Получение исходных изображений по путям из конфига с отключением текстового кодирования файлов
      .src(app.path.src.images, options)
      // Перехват возможных ошибок при обработке изображений (например, битый файл), чтобы Gulp не падал
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "WEBP", // Заголовок окна системной ошибки
            message: "Error: <%= error.message %>", // Шаблон вывода текста ошибки
          }),
        ),
      )
      // Проверка обновлений: обрабатываются только те картинки, которых еще нет в dist или которые изменились
      .pipe(app.plugins.newer(app.path.build.images))
      // Изменение размера картинок: если исходник шире 1920px, он пропорционально уменьшится. Если меньше — останется прежним (upscale: false)
      .pipe(
        sharpResponsive({
          formats: [{ width: 1920, upscale: false }],
        }),
      )
      // Логическое условие: конвертация в WebP происходит исключительно во время финальной сборки проекта (app.isBuild)
      .pipe(app.plugins.if(app.isBuild, webp()))
      // Сохранение получившихся WebP изображений в папку назначения в дистрибутиве
      .pipe(app.gulp.dest(app.path.build.images))
  );
};

// 2. Вспомогательная функция для оптимизации оригинальных JPG/PNG картинок
const optimizeImages = () => {
  // Возврат потока обработки файлов
  return (
    app.gulp
      // Снова берем те же исходные растровые картинки с бинарной опцией options
      .src(app.path.src.images, options)
      // Предотвращение поломки таска при возникновении ошибок в плагине imagemin или sharp
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "IMAGEMIN", // Заголовок окна уведомления
            message: "Error: <%= error.message %>", // Сообщение об ошибке
          }),
        ),
      )
      // Пропускаем через фильтр, чтобы не тратить время на повторную обработку неизмененных изображений
      .pipe(app.plugins.newer(app.path.build.images))
      // Точно так же ужимаем картинки по максимальной ширине до 1920px, если они больше
      .pipe(
        sharpResponsive({
          formats: [{ width: 1920, upscale: false }],
        }),
      )
      // Логическое условие: глубокое сжатие через imagemin запускается только при финальной сборке (app.isBuild)
      .pipe(
        app.plugins.if(
          app.isBuild,
          imagemin({
            progressive: true, // Прогрессивная загрузка для JPG (картинка появляется плавно, от размытой к четкой)
            interlaced: true, // Чересстрочная загрузка для GIF изображений
            optimizationLevel: 3, // Уровень оптимизации картинок (баланс между скоростью работы таска и весом файла)
          }),
        ),
      )
      // Сохранение оптимизированных JPG/PNG файлов в папку назначения
      .pipe(app.gulp.dest(app.path.build.images))
  );
};

// 3. Вспомогательная функция для копирования векторных SVG картинок (их не нужно конвертировать в WebP или ресайзить через Sharp)
const copySvg = () => {
  return (
    app.gulp
      // Выборка только SVG файлов из исходников
      .src(app.path.src.svg, options)
      // Проверка на новизну файла, чтобы не копировать лишний раз старые SVG
      .pipe(app.plugins.newer(app.path.build.images))
      // Прямое копирование вектора в итоговую папку с картинками
      .pipe(app.gulp.dest(app.path.build.images))
      // Перезапуск потока локального сервера для мгновенного отображения новых SVG на странице
      .pipe(app.plugins.browsersync.stream())
  );
};

// Основной экспорт таски картинок. Метод gulp.series запускает последовательно: сначала создание WebP, затем оптимизацию JPG/PNG, в конце — копирование SVG
// Аргумент done (callback) передается в поток, чтобы сигнализировать Gulp о полном завершении всей цепочки подзадач
export const images = (done) => {
  return app.gulp.series(makeWebp, optimizeImages, copySvg)(done);
};
