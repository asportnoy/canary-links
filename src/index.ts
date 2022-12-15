import { webpack } from "replugged";

export function runPlaintextPatches(): void {
  webpack.patchPlaintext([
    {
      replacements: [
        {
          match:
            /(""\.concat\(location\.protocol,"\/\/"\)\.concat\()location\.host(\)\.concat\(\w+\.\w+\.CHANNEL\(.+?\)\))/g,
          replace: (_, prefix, suffix) => {
            console.log(_, prefix, suffix);
            return `${prefix}"discord.com"${suffix}`;
          },
        },
      ],
    },
  ]);
}
