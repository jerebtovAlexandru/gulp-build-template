import * as nodePath from 'path';
const rootFolder = nodePath.basename(nodePath.resolve());

const buildFolder = `./dist`;
const srcFolder = `./src`;

 export const path = {
   build: {
     js: `${buildFolder}/js/`,
     css: `${buildFolder}/css/`,
     html: `${buildFolder}/`,
     images: `${buildFolder}/img/`,
     files: `${buildFolder}/files/`,
     fonts: `${buildFolder}/fonts/`,
   },
   src: {
     images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
     svg: `${srcFolder}/img/**/*.svg`,
     js: `${srcFolder}/js/app.js`,
     scss: `${srcFolder}/scss/style.scss`,
     html: `${srcFolder}/*.html`, //.pug
     files: `${srcFolder}/files/**/*.*`,
     svgicons: `${srcFolder}/svgicons/*.svg`,
     fonts: `${srcFolder}/fonts/**/*.*`,
   },
   watch: {
     images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg,ico}`,
     js: `${srcFolder}/**/*.js`,
     scss: `${srcFolder}/**/*.scss`,
     html: `${srcFolder}/**/*.html`, //.pug
     files: `${srcFolder}/files/**/*.*`,
   },
   clean: buildFolder,
   buildFolder: buildFolder,
   srcFolder: srcFolder,
   rootFolder: rootFolder,
   ftp: `test`,
 };