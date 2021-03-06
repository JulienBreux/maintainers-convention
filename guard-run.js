'use strict';
const _ = require('lodash');
const config = require('common-env')(console).getOrElseAll({
  github: {
    organisation: 'fgribreau',
    token: 'token'
  },
  maintainers: {
    filename: 'MAINTAINERS'
  }
});

require('./src/guard')(config).done(repositoriesWithMaintainers => {

  const repositoriesWithoutMaintainerFile = _.filter(repositoriesWithMaintainers, {
    maintainers: null
  });

  if (repositoriesWithoutMaintainerFile.length === 0) {
    return console.info('✔ good work guys :)');
  }

  process.stderr.write(`
✘ invalid repositories without "${config.maintainers.filename}" file found:

${repositoriesWithoutMaintainerFile.map((repo) => repo.repository.html_url).join('\n')}

--- Please add a missing "${config.maintainers.filename}" files ---
` , process.exit.bind(process, repositoriesWithoutMaintainerFile.length || 1));
}, err => {
  console.error('Error', err);
  process.exit(10);
})
