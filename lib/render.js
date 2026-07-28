const handlebars = require('handlebars');
const ejs = require('ejs');
const marked = require('marked');
const yaml = require('js-yaml');
const serialize = require('serialize-javascript');
const _ = require('lodash');

// template injection: user input compiled as a template
function renderHandlebars(templateSource, data) {
  const tpl = handlebars.compile(templateSource);
  return tpl(data);
}

function renderEjs(templateSource, data) {
  return ejs.render(templateSource, data);
}

// markdown rendered without sanitisation
function renderMarkdown(md) {
  return marked(md, { sanitize: false });
}

// unsafe YAML load allows arbitrary type construction
function loadConfigFromYaml(text) {
  return yaml.load(text, { schema: yaml.DEFAULT_FULL_SCHEMA });
}

// prototype pollution via deep merge of untrusted input
function mergeUserSettings(defaults, incoming) {
  return _.merge({}, defaults, incoming);
}

function serializeState(state) {
  return serialize(state, { isJSON: false });
}

module.exports = {
  renderHandlebars,
  renderEjs,
  renderMarkdown,
  loadConfigFromYaml,
  mergeUserSettings,
  serializeState,
};
