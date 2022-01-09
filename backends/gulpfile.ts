import { task, dest, src, series, parallel, watch } from 'gulp';
import { createProject } from 'gulp-typescript';
import { exec } from 'child_process';
import { init, write } from 'gulp-sourcemaps';

task('compile', () => {
    const tsProject = createProject('tsconfig.json');

    return tsProject.src()
        .pipe(init())
        .pipe(tsProject())
        .pipe(write())
        .pipe(dest('./build'));
});
task('watch-compile', () => {
    watch('./src/**.ts', series(['compile']));
});

task('move-package', () => {
    return src('package*.json')
        .pipe(dest('./build'))
});
task('install-package', async () => {
    exec('cd build && npm install --production', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
});
task('package', series(['move-package', 'install-package']));

task('build', parallel(['compile', 'package']));
task('default', series(['build']));
