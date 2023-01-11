import { types } from "replugged";

const patches: types.PlaintextPatch[] = [
  {
    replacements: [
      {
        match:
          /(""\.concat\(location\.protocol,"\/\/"\)\.concat\()location\.host(\)\.concat\(\w+\.\w+\.CHANNEL\(.+?\)\))/g,
        replace: (_, prefix, suffix) => {
          return `${prefix}"discord.com"${suffix}`;
        },
      },
    ],
  },
  {
    replacements: [
      {
        match:
          /(""\.concat\()\w+\.\w+\.getAPIBaseURL\(!1\)(\)\.concat\(\w+\.ANM\.WEBHOOK_INTEGRATION\(\w+\.id,\w+\.token\)\))/g,
        replace: (_, prefix, suffix) => {
          return `${prefix}"${location.protocol}//discord.com/api"${suffix}`;
        },
      },
    ],
  },
];

export default patches;
