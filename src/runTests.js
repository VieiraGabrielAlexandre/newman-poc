const newman = require('newman');

newman.run({
    collection: require('../collection-postman.json'),
    reporters: ['cli'],
    reporter: {
        htmlextra: {
            export: './newman-report.html',
        }
    }
}, function (err, summary) {
    if (err) { throw err; }
    console.log('Collection run complete!');

    if (summary.run.failures.length > 0) {
        console.error('Some tests failed!');
        process.exit(1);
    } else {
        console.log('All tests passed!');
    }
});