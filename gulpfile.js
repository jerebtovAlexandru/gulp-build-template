// Основной модуль Gulp для управления задачами и потоками файлов
import gulp from "gulp";
// Импорт объекта с путями к исходным файлам и папке назначения (дистрибутиву)
import { path } from "./gulp/config/path.js";
// Импорт объекта, объединяющего все часто используемые плагины в одну переменную
import { plugins } from "./gulp/config/plugins.js";

// Создание глобального объекта app для доступа к ключевым сущностям из любого файла задачи (task)
global.app = {
  // Флаг режима продакшена: true, если в консоли передан аргумент --build
  isBuild: process.argv.includes("--build"),
  // Флаг режима разработки: true, если аргумент --build отсутствует в строке запуска
  isDev: !process.argv.includes("--build"),
  // Передача объекта путей в глобальную область видимости
  path: path,
  // Передача самого модуля Gulp в глобальную область видимости
  gulp: gulp,
  // Передача общих плагинов в глобальную область видимости
  plugins: plugins,
};

// Импорт отдельной задачи для копирования статичных файлов (например, txt, json)
import { copy } from "./gulp/tasks/copy.js";
// Импорт задачи для оптимизации, изменения размеров и конвертации картинок
import { images } from "./gulp/tasks/images.js";
// Импорт задачи для очистки папки с готовой сборкой перед запуском новых задач
import { reset } from "./gulp/tasks/reset.js";
// Импорт задачи для сборки HTML (включая модульные части и замену путей)
import { html } from "./gulp/tasks/html.js";
// Импорт задачи для запуска локального сервера и управления автоперезагрузкой
import { server } from "./gulp/tasks/server.js";
// Импорт задачи для компиляции SCSS/SASS стилей, группировки медиа и минификации
import { scss } from "./gulp/tasks/scss.js";
// Импорт задачи для сборки и оптимизации JavaScript кода с помощью Webpack
import { js } from "./gulp/tasks/js.js";
// Импорт набора подзадач для полной обработки шрифтов (конвертация и генерация стилей)
import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";
// Импорт отдельной задачи для создания единого SVG-спрайта из иконок
import { svgSprive } from "./gulp/tasks/svgSprive.js";
// Импорт внешней функции удаления файлов для очистки промежуточных шрифтов
import { deleteAsync } from "del";
// Импорт задачи для упаковки готового проекта в zip-архив
import { zip } from "./gulp/tasks/zip.js";
// Импорт задачи для выгрузки собранного проекта на удаленный сервер по FTP
import { ftp } from "./gulp/tasks/ftp.js";

// Вспомогательная функция для удаления промежуточных файлов TTF из папки назначения после конвертации
const cleanExtraFonts = () => {
  // Асинхронно удаляет все файлы с расширением .ttf в скомпилированной папке шрифтов
  return deleteAsync(`${path.build.fonts}*.ttf`);
};

// Функция-наблюдатель (Watcher) за изменениями в исходных файлах проекта в реальном времени
function watcher() {
  // При изменении обычных файлов в корневой папке запускается задача копирования copy
  gulp.watch(path.watch.files, copy);
  // При изменении любого HTML-файла перезапускается задача сборки html
  gulp.watch(path.watch.html, html);
  // При изменении любого SCSS-файла перезапускается компиляция стилей scss
  gulp.watch(path.watch.scss, scss);
  // При изменении любого JS-файла перезапускается сборка скриптов js
  gulp.watch(path.watch.images, images);
}

// Экспорт задачи генерации SVG-спрайта для ее изолированного запуска вручную через консоль
export { svgSprive };

// Последовательный сценарий обработки шрифтов: сначала OTF в TTF, затем TTF в WOFF/WOFF2, в конце — запись стилей
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle);

// Основной блок задач: сначала обрабатываются шрифты, затем параллельно собираются все остальные типы файлов
const mainTasks = gulp.series(
  fonts,
  gulp.parallel(copy, html, scss, js, images),
);

// Сценарий для режима разработки: очистка папки, сборка файлов, удаление лишних шрифтов, запуск вотчера и сервера
const dev = gulp.series(
  reset,
  mainTasks,
  cleanExtraFonts,
  gulp.parallel(watcher, server),
);

// Сценарий для финальной продакшен-сборки: очистка папки, полная сборка файлов и удаление временных файлов TTF
const build = gulp.series(reset, mainTasks, cleanExtraFonts);

// Сценарий архивации: очистка папки, полная сборка проекта и последующая упаковка в ZIP
const deployZIP = gulp.series(reset, mainTasks, zip);

// Сценарий деплоя: очистка папки, полная сборка проекта и последующая отправка всех файлов на FTP-сервер
const deployFTP = gulp.series(reset, mainTasks, ftp);

// Экспорт сценария разработки для внешнего использования (запуск команды "gulp dev" или просто "gulp")
export { dev };
// Экспорт сценария полной сборки проекта для команды "gulp build"
export { build };
// Экспорт сценария архивации для команды "gulp deployZIP"
export { deployZIP };
// Экспорт сценария выгрузки на сервер для команды "gulp deployFTP"
export { deployFTP };

// Назначение сценария 'dev' в качестве основной задачи по умолчанию при вводе команды "gulp" в терминале
gulp.task("default", dev);
