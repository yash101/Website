import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals.map((config) => {
    if (!config.plugins?.["@typescript-eslint"]) {
      return config;
    }

    return {
      ...config,
      rules: {
        ...config.rules,
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "react-hooks/error-boundaries": "off",
        "react-hooks/immutability": "off",
        "react-hooks/purity": "off",
        "react-hooks/set-state-in-effect": "off",
      },
    };
  }),
];

export default eslintConfig;
