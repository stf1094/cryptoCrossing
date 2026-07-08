import coreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...coreWebVitals,
  {
    rules: {
      // React 19's set-state-in-effect rule flags a couple of intentional
      // prop-into-state sync patterns (PriceTable, AddCoinSlideover). Keep it
      // visible as a warning rather than a hard build failure, pending refactor.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },
];

export default eslintConfig;
