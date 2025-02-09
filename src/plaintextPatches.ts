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
          /(""\.concat\()\(0,\w+\.\w+\)\(!1\)(\)\.concat\(\w+\.\w+\.WEBHOOK_INTEGRATION\(\w+\.id,\w+\.token\)\))/g,
        replace: (_, prefix, suffix) => {
          return `${prefix}location.protocol+"//discord.com/api"${suffix}`;
        },
      },
    ],
  },
];

export default patches;
