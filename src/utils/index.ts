import fs from 'fs';
import path from 'path';

const absolutePath = (...paths: string[]) => {
  return path.resolve(process.cwd(), ...paths);
};

const pkgJSON = path.resolve(absolutePath('package.json'));

export const getLibraryName = () => {
  const name: string = JSON.parse(fs.readFileSync(pkgJSON).toString()).name;
  if (!/^@.+\/.+$/.test(name)) {
    throw new Error(`name in package.json is not fit as /^@.+\/.+$/`);
  }
  const formattedName = name
    .split('/')[1]!
    .split('-')
    .map((item) => item[0]!.toUpperCase() + item.slice(1))
    .join('');

  return `T${formattedName}`;
};
