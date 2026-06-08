import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./dist`;
const srcFolder = `./src`;

 export const path = {
   build: {
     css: `${buildFolder}/css/`,
     html: `${buildFolder}/`,
     files: `${buildFolder}/files/`,
   },
   src: {
     scss: `${srcFolder}/scss/style.scss`,
     html: `${srcFolder}/*.html`, //.pug
     files: `${srcFolder}/files/**/*.*`, // ** - Проверка всех вложенных папок по пути , *.* - любые файлы с любым разрешением .
   },
   watch: {
     scss: `${srcFolder}/**/*.scss`,
     html: `${srcFolder}/**/*.html`, //.pug
     files: `${srcFolder}/files/**/*.*`,
   },
   clean: buildFolder,
   buildFolder: buildFolder,
   srcFolder: srcFolder,
   rootFolder: rootFolder,
   ftp: ``,
 };