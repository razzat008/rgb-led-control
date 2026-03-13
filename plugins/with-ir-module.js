const {
  withSettingsGradle,
  withAppBuildGradle,
} = require("@expo/config-plugins");

function withIrModuleSettingsGradle(config) {
  return withSettingsGradle(config, (config) => {
    const tag = "withIrModule";
    const settings = config.modResults.contents;

    if (settings.includes("modules/ir/android")) {
      return config;
    }

    const includeLine = 'include(":modules:ir:android")';
    const projectLine =
      'project(":modules:ir:android").projectDir = new File(settingsDir, "../modules/ir/android")';

    config.modResults.contents = [
      settings.trim(),
      `\n// ${tag}`,
      includeLine,
      projectLine,
      "",
    ].join("\n");

    return config;
  });
}

function withIrModuleAppBuildGradle(config) {
  return withAppBuildGradle(config, (config) => {
    const tag = "withIrModule";
    const buildGradle = config.modResults.contents;

    if (buildGradle.includes("modules:ir:android")) {
      return config;
    }

    const dependencyLine = 'implementation project(":modules:ir:android")';

    if (buildGradle.includes("dependencies {")) {
      config.modResults.contents = buildGradle.replace(
        /dependencies\s*\{\s*\n/,
        (match) => `${match}    // ${tag}\n    ${dependencyLine}\n`,
      );
    } else {
      config.modResults.contents = [
        buildGradle.trim(),
        `\n// ${tag}`,
        "dependencies {",
        `    ${dependencyLine}`,
        "}",
        "",
      ].join("\n");
    }

    return config;
  });
}

module.exports = function withIrModule(config) {
  config = withIrModuleSettingsGradle(config);
  config = withIrModuleAppBuildGradle(config);
  return config;
};
