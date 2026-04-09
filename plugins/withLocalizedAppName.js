/**
 * Expo Config Plugin: Localized App Name
 *
 * iOS: Generates InfoPlist.strings with CFBundleDisplayName per language
 *      and registers them in the Xcode project as a variant group.
 * Android: Generates strings.xml with app_name per language in values-{locale}/
 *
 * Usage in app.config.ts:
 *   plugins: [
 *     ['./plugins/withLocalizedAppName', {
 *       en: 'QR Scan & Create',
 *       ko: 'QR 스캔 & 생성',
 *       ja: 'QRスキャン&作成',
 *       ...
 *     }],
 *   ]
 */

const {
  withXcodeProject,
  withDangerousMod,
  IOSConfig,
} = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

// iOS locale code mapping
const IOS_LOCALE_MAP = {
  en: 'en',
  ko: 'ko',
  ja: 'ja',
  'zh-Hans': 'zh-Hans',
  zh: 'zh-Hans',
  es: 'es',
  pt: 'pt-BR',
  'pt-BR': 'pt-BR',
  fr: 'fr',
  de: 'de',
  it: 'it',
  ru: 'ru',
  tr: 'tr',
  th: 'th',
  vi: 'vi',
  id: 'id',
  ms: 'ms',
  hi: 'hi',
  ar: 'ar',
  nl: 'nl',
  pl: 'pl',
  sv: 'sv',
};

// Android locale code mapping
const ANDROID_LOCALE_MAP = {
  en: '',
  ko: 'ko',
  ja: 'ja',
  'zh-Hans': 'zh-rCN',
  zh: 'zh-rCN',
  es: 'es',
  pt: 'pt-rBR',
  'pt-BR': 'pt-rBR',
  fr: 'fr',
  de: 'de',
  it: 'it',
  ru: 'ru',
  tr: 'tr',
  th: 'th',
  vi: 'vi',
  id: 'in',
  ms: 'ms',
  hi: 'hi',
  ar: 'ar',
  nl: 'nl',
  pl: 'pl',
  sv: 'sv',
};

function withLocalizedAppNameIOS(config, localizedNames) {
  // Step 1: Write InfoPlist.strings files
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const projectName = IOSConfig.XcodeUtils.getProjectName(projectRoot);
      const iosDir = path.join(projectRoot, 'ios', projectName);

      for (const [locale, name] of Object.entries(localizedNames)) {
        const iosLocale = IOS_LOCALE_MAP[locale] || locale;
        const lprojDir = path.join(iosDir, `${iosLocale}.lproj`);

        if (!fs.existsSync(lprojDir)) {
          fs.mkdirSync(lprojDir, { recursive: true });
        }

        const content = `"CFBundleDisplayName" = "${name}";\n"CFBundleName" = "${name}";\n`;
        fs.writeFileSync(
          path.join(lprojDir, 'InfoPlist.strings'),
          content,
          'utf-8'
        );
      }

      return config;
    },
  ]);

  // Step 2: Add InfoPlist.strings as variant group to Xcode project
  config = withXcodeProject(config, (config) => {
    const project = config.modResults;
    const projectName = config.modRequest.projectName;

    // Add known regions
    const locales = Object.keys(localizedNames).map(
      (l) => IOS_LOCALE_MAP[l] || l
    );

    try {
      const pbxProject = project.getFirstProject();
      if (pbxProject && pbxProject.firstProject) {
        const knownRegions = pbxProject.firstProject.knownRegions || [];
        for (const locale of locales) {
          if (!knownRegions.includes(locale)) {
            knownRegions.push(locale);
          }
        }
        pbxProject.firstProject.knownRegions = knownRegions;
      }
    } catch {
      // Ignore
    }

    // Create variant group for InfoPlist.strings and add to Resources build phase
    try {
      // Find the project name group (e.g. QRScanCreate) to add files under it
      const groups = project.hash.project.objects['PBXGroup'] || {};
      let projectGroupKey = null;
      for (const [key, value] of Object.entries(groups)) {
        if (value && value.name === projectName && !key.endsWith('_comment')) {
          projectGroupKey = key;
          break;
        }
        // Also check path-based groups
        if (value && value.path === projectName && !key.endsWith('_comment')) {
          projectGroupKey = key;
          break;
        }
      }

      // Check if variant group already exists
      const variantGroups = project.hash.project.objects['PBXVariantGroup'] || {};
      let existingGroupKey = null;
      for (const [key, value] of Object.entries(variantGroups)) {
        if (value && value.name === 'InfoPlist.strings') {
          existingGroupKey = key;
          break;
        }
      }

      if (!existingGroupKey) {
        const variantGroupKey = project.generateUuid();
        const variantGroupCommentKey = `${variantGroupKey}_comment`;

        const children = [];
        for (const locale of locales) {
          const fileRefKey = project.generateUuid();
          const fileRefCommentKey = `${fileRefKey}_comment`;

          if (!project.hash.project.objects['PBXFileReference']) {
            project.hash.project.objects['PBXFileReference'] = {};
          }
          project.hash.project.objects['PBXFileReference'][fileRefKey] = {
            isa: 'PBXFileReference',
            lastKnownFileType: 'text.plist.strings',
            name: locale,
            path: `${projectName}/${locale}.lproj/InfoPlist.strings`,
            sourceTree: '"<group>"',
          };
          project.hash.project.objects['PBXFileReference'][fileRefCommentKey] =
            `${locale} — InfoPlist.strings`;

          children.push({
            value: fileRefKey,
            comment: `${locale} — InfoPlist.strings`,
          });
        }

        if (!project.hash.project.objects['PBXVariantGroup']) {
          project.hash.project.objects['PBXVariantGroup'] = {};
        }
        project.hash.project.objects['PBXVariantGroup'][variantGroupKey] = {
          isa: 'PBXVariantGroup',
          children: children,
          name: 'InfoPlist.strings',
          sourceTree: '"<group>"',
        };
        project.hash.project.objects['PBXVariantGroup'][variantGroupCommentKey] =
          'InfoPlist.strings';

        // Add to the main group (top-level)
        const mainGroupKey = project.getFirstProject().firstProject.mainGroup;
        const mainGroup = groups[mainGroupKey];
        if (mainGroup && mainGroup.children) {
          mainGroup.children.push({
            value: variantGroupKey,
            comment: 'InfoPlist.strings',
          });
        }

        // Add build file for Resources phase
        const buildFileKey = project.generateUuid();
        const buildFileCommentKey = `${buildFileKey}_comment`;

        if (!project.hash.project.objects['PBXBuildFile']) {
          project.hash.project.objects['PBXBuildFile'] = {};
        }
        project.hash.project.objects['PBXBuildFile'][buildFileKey] = {
          isa: 'PBXBuildFile',
          fileRef: variantGroupKey,
          fileRef_comment: 'InfoPlist.strings',
        };
        project.hash.project.objects['PBXBuildFile'][buildFileCommentKey] =
          'InfoPlist.strings in Resources';

        // Add to Resources build phase
        const nativeTargets =
          project.hash.project.objects['PBXNativeTarget'] || {};
        for (const [, target] of Object.entries(nativeTargets)) {
          if (target && target.buildPhases) {
            for (const phase of target.buildPhases) {
              const phaseObj =
                project.hash.project.objects['PBXResourcesBuildPhase']?.[
                  phase.value
                ];
              if (phaseObj && phaseObj.files) {
                phaseObj.files.push({
                  value: buildFileKey,
                  comment: 'InfoPlist.strings in Resources',
                });
                break;
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('withLocalizedAppName: Failed to add variant group:', e.message);
    }

    return config;
  });

  return config;
}

function withLocalizedAppNameAndroid(config, localizedNames) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const resDir = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'res'
      );

      for (const [locale, name] of Object.entries(localizedNames)) {
        const androidLocale = ANDROID_LOCALE_MAP[locale];
        if (androidLocale === undefined) continue;

        const valuesDir =
          androidLocale === ''
            ? path.join(resDir, 'values')
            : path.join(resDir, `values-${androidLocale}`);

        if (!fs.existsSync(valuesDir)) {
          fs.mkdirSync(valuesDir, { recursive: true });
        }

        const stringsPath = path.join(valuesDir, 'strings.xml');

        if (fs.existsSync(stringsPath)) {
          let content = fs.readFileSync(stringsPath, 'utf-8');
          if (content.includes('name="app_name"')) {
            content = content.replace(
              /<string name="app_name">[^<]*<\/string>/,
              `<string name="app_name">${escapeXml(name)}</string>`
            );
          } else {
            content = content.replace(
              '</resources>',
              `    <string name="app_name">${escapeXml(name)}</string>\n</resources>`
            );
          }
          fs.writeFileSync(stringsPath, content, 'utf-8');
        } else {
          const content = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <string name="app_name">${escapeXml(name)}</string>\n</resources>\n`;
          fs.writeFileSync(stringsPath, content, 'utf-8');
        }
      }

      return config;
    },
  ]);
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");
}

function withLocalizedAppName(config, localizedNames) {
  config = withLocalizedAppNameIOS(config, localizedNames);
  config = withLocalizedAppNameAndroid(config, localizedNames);
  return config;
}

module.exports = withLocalizedAppName;
