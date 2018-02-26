import _debug from 'debug';
import webpack from 'webpack';
import webpackConfig from './webpack.config';

const debug = _debug('app:compile');

webpack(webpackConfig, function (err, stats) {
    debug(`Webpack compile completed in ${stats.endTime - stats.startTime}ms.`);
});
