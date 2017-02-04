import {
    src, tsconfig, stdout, stderr,
    spec, exec
} from './utils';

import { config } from './compile-output';

spec(__filename, async function(env, done) {
    const index = src('index.ts', `
        export default function sum(a: number, b: number) {
            return a + b;
        }

        sum(1, '1');
    `);

    tsconfig();
    config(env);

    const webpack = exec('webpack', ['--watch']);

    await webpack.wait(
        stdout('Webpack is watching the files…'),
        stderr('Checking finished with 1 errors'),
        stdout([
            'ERROR in [at-loader]',
            `Argument of type '"1"' is not assignable to parameter of type 'number'`
        ]),
    );

    index.update(() => `
        export default function sum(a: number, b: number) {
            return a + b;
        }

        sum(1, 1);
    `);

    await webpack.wait(
        stdout([
            [true, '[emitted]'], [false, 'ERROR']
        ])
    );

    webpack.close();
    done();
});

