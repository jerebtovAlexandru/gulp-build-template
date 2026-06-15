// Импорт системного модуля Node.js "fs" для непосредственной работы с файловой системой (чтение, запись, проверка файлов)
import fs from "fs";
// Импорт плагина gulp-fonter для базовой конвертации шрифтов (поддерживает OTF, TTF, EOT, WOFF)
import fonter from "gulp-fonter";
// Импорт специализированного плагина gulp-ttf2woff2 для создания максимально сжатого веб-формата WOFF2
import ttf2woff2 from "gulp-ttf2woff2";

// 1. Задача конвертации старых или исходных шрифтов из формата OpenType (OTF) в TrueType (TTF)
export const otfToTtf = () => {
  // Возврат потока для контроля завершения асинхронного таска
  return (
    app.gulp
      // Ищем абсолютно все файлы с расширением .otf в исходной папке шрифтов проекта
      .src(`${app.path.srcFolder}/fonts/*.otf`, {})
      // Предотвращение поломки (падения) Gulp при обнаружении битого или некорректного файла шрифта
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "FONTS", // Заголовок всплывающего системного окна
            message: "Error: <%= error.message %>", // Шаблон вывода текста ошибки
          }),
        ),
      )
      // Запуск плагина fonter для конвертации найденных .otf файлов в формат .ttf
      .pipe(
        fonter({
          formats: ["ttf"],
        }),
      )
      // Выгрузка полученных .ttf файлов обратно в ту же исходную папку, чтобы их подхватила следующая задача
      .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`))
  );
};

// 2. Задача конвертации шрифтов TrueType (TTF) в современные оптимизированные веб-форматы WOFF и WOFF2
export const ttfToWoff = () => {
  // Возврат общего потока файлов для Gulp
  return (
    app.gulp
      // Ищем все файлы .ttf в исходной папке (включая только что созданные из OTF)
      .src(`${app.path.srcFolder}/fonts/*.ttf`, {})
      // Защита потока от прерывания при возникновении ошибок компиляции
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "FONTS",
            message: "Error: <%= error.message %>",
          }),
        ),
      )
      // Первая конвертация: переводим исходные .ttf в стандартный веб-формат .woff
      .pipe(
        fonter({
          formats: ["woff"],
        }),
      )
      // Сохраняем полученные .woff файлы в итоговую папку сборки (дистрибутив)
      .pipe(app.gulp.dest(`${app.path.build.fonts}`))
      // Снова открываем поток и заново читаем исходные .ttf файлы для генерации WOFF2
      .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
      // Вторая конвертация: переводим .ttf в самый современный и легкий формат .woff2
      .pipe(ttf2woff2())
      // Выгружаем полученные .woff2 файлы в ту же итоговую папку сборки к файлам .woff
      .pipe(app.gulp.dest(`${app.path.build.fonts}`))
  );
};

// 3. Задача автоматической генерации SCSS-кода для подключения всех собранных шрифтов на сайт
export const fontsStyle = () => {
  // Определение пути к будущему файлу стилей, где пропишутся правила @font-face
  let fontsFile = `${app.path.srcFolder}/scss/fonts.scss`;

  // Асинхронное чтение содержимого папки с готовыми скомпилированными веб-шрифтами в дистрибутиве
  fs.readdir(app.path.build.fonts, function (err, fontsFiles) {
    // Если в папке обнаружены файлы шрифтов
    if (fontsFiles) {
      // Проверка: если файла scss/fonts.scss ЕЩЕ НЕ существует, то создаем его (чтобы случайно не затереть ручные правки верстальщика)
      if (!fs.existsSync(fontsFile)) {
        // Создание нового абсолютно пустого файла fonts.scss с передачей функции обратного вызова (cb)
        fs.writeFile(fontsFile, "", cb);
        let newFileOnly; // Вспомогательная переменная для предотвращения дублирования стилей одного и того же шрифта

        // Перебор всех найденных файлов шрифтов в цикле
        for (var i = 0; i < fontsFiles.length; i++) {
          // Разделяем имя файла по точке и берем первый элемент, тем самым отсекая расширение (.woff/.woff2) и получая чистое имя
          let fontFileName = fontsFiles[i].split(".")[0];

          // Если имя файла уникально и мы еще не обрабатывали его в этой итерации (чтобы не писать стили отдельно для woff и woff2)
          if (newFileOnly !== fontFileName) {
            // Разделяем имя по дефису для определения названия и начертания (например, "Roboto-Bold" -> ["Roboto", "Bold"])
            // Если дефиса нет, в имя запишется полное название файла
            let fontName = fontFileName.split("-")[0]
              ? fontFileName.split("-")[0]
              : fontFileName;
            // Если дефиса нет, начертание временно дублирует имя (обработается в блоке else ниже как 400)
            let fontWeight = fontFileName.split("-")[1]
              ? fontFileName.split("-")[1]
              : fontFileName;

            // Логический блок сопоставления текстового названия начертания с цифровыми стандартами CSS (Font Weight CSS)
            if (fontWeight.toLowerCase() === "thin") {
              fontWeight = 100; // Сверхтонкое начертание
            } else if (fontWeight.toLowerCase() === "extralight") {
              fontWeight = 200; // Очень тонкое
            } else if (fontWeight.toLowerCase() === "light") {
              fontWeight = 300; // Легкое / Тонкое
            } else if (fontWeight.toLowerCase() === "medium") {
              fontWeight = 500; // Среднее
            } else if (fontWeight.toLowerCase() === "semibold") {
              fontWeight = 600; // Полужирное
            } else if (fontWeight.toLowerCase() === "bold") {
              fontWeight = 700; // Жирное
            } else if (
              fontWeight.toLowerCase() === "extrabold" ||
              fontWeight.toLowerCase() === "heavy"
            ) {
              fontWeight = 800; // Сверхжирное
            } else if (fontWeight.toLowerCase() === "black") {
              fontWeight = 900; // Самое тяжелое / Черное
            } else {
              fontWeight = 400; // По умолчанию: обычное начертание (Regular / Normal)
            }

            // Асинхронное добавление (дозапись) готового блока стилей @font-face в конец файла fonts.scss
            // Используется font-display: swap для мгновенного отображения системного шрифта до полной загрузки основного кастомного
            fs.appendFile(
              fontsFile,
              `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`,
              cb,
            );
            // Запоминаем имя обработанного файла, чтобы пропустить его дубликат с другим расширением на следующем шаге цикла
            newFileOnly = fontFileName;
          }
        }
      } else {
        // Если файл scss/fonts.scss уже был создан ранее, выводим предупреждение в консоль без перезаписи файла
        console.log(
          "Файл scss/fonts.scss уже существует. Для обновления файла нужно его удалить!",
        );
      }
    }
  });

  // Возвращаем поток исходной папки Gulp, чтобы таск считался валидным и завершенным для системы сборщика
  return app.gulp.src(`${app.path.srcFolder}`);
  // Пустая функция обратного вызова (заглушка), необходимая методам fs для корректной работы
  function cb() {}
};
