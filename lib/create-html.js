// Custom rollup plugin for creating html pages
import { readFileSync } from 'fs';
import mustache from 'mustache';
import { findHashFromName } from './bundle-utils';
import { version } from '../package.json';

function generateShell(bundle, { templatePath, isDev, rollbarClientToken }) {
  const template = readFileSync(templatePath, 'utf8');
  return mustache.render(template, {
    isProduction: !isDev,
    isDev,
    rollbarClientToken,
    scriptFile: findHashFromName(bundle, 'main'),
    title: 'Ventilate!',
    version,
  });
}

export default function createHTMLPlugin({ isDev, version, rollbarClientToken }) {
  const templatePath = 'src/index.mustache';
  return {
    name: 'create-html-plugin',
    buildStart() {
      this.addWatchFile(templatePath);
    },
    async generateBundle(options, bundle) {
      this.emitFile({
        fileName: 'index.html',
        type: 'asset',
        source: await generateShell(bundle, { templatePath, isDev, rollbarClientToken, version }),
      });
      // 404.html is a 'magic' file for http-server so local dev
      // SPA works
      if(isDev) {
        this.emitFile({
          fileName: '404.html',
          type: 'asset',
          source: await generateShell(bundle, { templatePath, isDev, rollbarClientToken, version }),
        });
      }
    },
  };
}
