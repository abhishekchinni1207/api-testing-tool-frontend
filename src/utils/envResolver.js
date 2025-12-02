export function resolveEnv(text, env) {
  if (!env?.variables) return text;
  let result = text;

  Object.entries(env.variables).forEach(([key, value]) => {
    result = result.replaceAll(`{{${key}}}`, value);
  });

  return result;
}
