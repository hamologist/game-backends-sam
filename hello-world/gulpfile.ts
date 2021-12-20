import { task, dest, src, series, parallel } from 'gulp';
import { createProject } from 'gulp-typescript';
import { exec } from 'child_process';

task('compile', () => {
    const tsProject = createProject('tsconfig.json');
    const tsResult = tsProject.src()
        .pipe(tsProject());

    return tsResult.js.pipe(dest('./build'));
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
