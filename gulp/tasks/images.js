import webp from "gulp-webp";
import imagemin from "gulp-imagemin";
import sharpResponsive from "gulp-sharp-responsive";

const options = { encoding: false };

const makeWebp = () => {
  return (
    app.gulp
      .src(app.path.src.images, options)
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "WEBP",
            message: "Error: <%= error.message %>",
          }),
        ),
      )
      .pipe(app.plugins.newer(app.path.build.images))
      .pipe(
        sharpResponsive({
          formats: [{ width: 1920, upscale: false }],
        }),
      )
      .pipe(app.plugins.if(app.isBuild, webp()))
      .pipe(app.gulp.dest(app.path.build.images))
  );
};

const optimizeImages = () => {
  return (
    app.gulp
      .src(app.path.src.images, options)
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "IMAGEMIN",
            message: "Error: <%= error.message %>",
          }),
        ),
      )
      .pipe(app.plugins.newer(app.path.build.images))
      .pipe(
        sharpResponsive({
          formats: [{ width: 1920, upscale: false }],
        }),
      )
      .pipe(
        app.plugins.if(
          app.isBuild,
          imagemin({
            progressive: true,
            interlaced: true,
            optimizationLevel: 3,
          }),
        ),
      )
      .pipe(app.gulp.dest(app.path.build.images))
  );
};

const copySvg = () => {
  return app.gulp
    .src(app.path.src.svg, options)
    .pipe(app.plugins.newer(app.path.build.images))
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browsersync.stream());
};

export const images = (done) => {
  return app.gulp.series(makeWebp, optimizeImages, copySvg)(done);
};
