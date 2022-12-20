import { PlaintextPatch } from "replugged";

const patches: PlaintextPatch[] = [
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
