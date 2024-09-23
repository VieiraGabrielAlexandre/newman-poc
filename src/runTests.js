const newman = require('newman');
const axios = require('axios');

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

        const errorMessage = summary.run.failures.map(failure => {
            return `Test: ${failure.source.name}\nError: ${failure.error.test}\nMessage: ${failure.error.message}`;
        }).join('\n\n');

        const payload = {
            cards: [
                {
                    header: {
                        title: "Os testes falharam !"
                    },
                    sections: [
                        {
                            widgets: [
                                {
                                    textParagraph: {
                                        text: `Os testes falharam:\n\n${errorMessage}`
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        axios.post('https://chat.googleapis.com/v1/spaces/AAAA6Tzk2YA/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=YeSj0rwqzcjs4dmJJ1Vy0LUspdcADFm0h8TBvBXE0ZM', payload)
        .then(response => {
            console.log('Error message sent successfully:', response.data);
            process.exit(1);
        })
        .catch(error => {
            console.error('Failed to send error message:', error);
            process.exit(1);
        });
    } else {
        console.log('All tests passed!');

        const payload = {
            cards: [
                {
                    header: {
                        title: "Todos os testes passaram!"
                    },
                    sections: [
                        {
                            widgets: [
                                {
                                    textParagraph: {
                                        text: "Todos os testes passaram com sucesso."
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        axios.post('https://chat.googleapis.com/v1/spaces/AAAA6Tzk2YA/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=YeSj0rwqzcjs4dmJJ1Vy0LUspdcADFm0h8TBvBXE0ZM', payload)
        .then(response => {
            console.log('Success message sent successfully:', response.data);
        })
        .catch(error => {
            console.error('Failed to send success message:', error);
        });
    }
});