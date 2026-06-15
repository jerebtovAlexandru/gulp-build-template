// Импорт плагина gulp-replace для поиска текста по строкам или регулярным выражениям и его автоматической замены
import replace from "gulp-replace";
// Импорт плагина gulp-plumber для перехвата и изоляции ошибок в потоках без аварийной остановки работы Gulp
import plumber from "gulp-plumber";
// Импорт плагина gulp-notify для создания всплывающих системных уведомлений об ошибках или успешном выполнении задач
import notify from "gulp-notify";
// Импорт основного модуля browser-sync для создания локального сервера и синхронизации действий в браузере
import browsersync from "browser-sync";
// Импорт плагина gulp-newer для проверки обновлений файлов (пропускает неизмененные файлы для экономии времени сборки)
import newer from "gulp-newer";
// Импорт плагина gulp-if под именем ifPlugin для выполнения плагинов по условию (например, только в режиме продакшена)
import ifPlugin from "gulp-if";

// Экспорт единого объекта plugins, который объединяет все импортированные модули под удобными короткими именами
export const plugins = {
  replace: replace, // Доступен в тасках как app.plugins.replace
  plumber: plumber, // Доступен в тасках как app.plugins.plumber
  notify: notify, // Доступен в тасках как app.plugins.notify
  browsersync: browsersync, // Доступен в тасках как app.plugins.browsersync
  newer: newer, // Доступен в тасках как app.plugins.newer
  if: ifPlugin, // Доступен в тасках как app.plugins.if
};
