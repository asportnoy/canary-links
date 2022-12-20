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
];

export default patches;
