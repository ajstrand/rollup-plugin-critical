var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});

// src/index.ts
import path from "path";
var critical = __require("critical");
var criticalSuffix = "_critical.min.css";
var defaultCriticalConfig = {
  inline: false,
  extract: false,
  width: 1200,
  height: 1200,
  penthouse: {
    blockJSRequests: false
  }
};
function PluginCritical(pluginConfig, callback) {
  return {
    name: "critical",
    async writeBundle(outputOptions, bundle) {
      const css = [];
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === "asset" && chunk.fileName.endsWith(".css")) {
          const cssFile = path.join(outputOptions.dir || "", chunk.fileName);
          css.push(cssFile);
        }
      }
      if (!css.length) {
        return;
      }
      for (const page of pluginConfig.criticalPages) {
        const criticalBase = pluginConfig.criticalBase;
        const criticalSrc = pluginConfig.criticalUrl + page.uri;
        const criticalDest = page.template + criticalSuffix;
        const options = Object.assign({ css }, defaultCriticalConfig, {
          base: criticalBase,
          src: criticalSrc,
          target: criticalDest
        }, pluginConfig.criticalConfig);
        console.log(`Generating critical CSS from ${criticalSrc} to ${criticalDest}`);
        await critical.generate(options, (err) => {
          if (err) {
            console.error(err);
          }
          if (callback) {
            callback(err);
          }
        });
      }
    }
  };
}
var src_default = PluginCritical;
export {
  src_default as default
};
//# sourceMappingURL=index.mjs.map
