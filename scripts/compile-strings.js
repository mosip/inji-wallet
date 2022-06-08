const fs = require('fs');
const glob = require('glob');

glob('**/*.strings.json', (_err, paths) => {
  const strings = {};

  paths.forEach((path) => {
    const key = path.match(/(?<ns>[^/]+)\.strings\.json$/).groups.ns;
    strings[key] = JSON.parse(fs.readFileSync(path));
  });

  fs.writeFileSync(`locales/en.json`, JSON.stringify(strings, null, 2));
});
