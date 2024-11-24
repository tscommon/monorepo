import React from 'react';

interface PackageDescriptionProps {
  name: string;
}

const PackageDescription: React.FC<React.PropsWithChildren<PackageDescriptionProps>> = ({ name, children }) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
  const { description } = require(`../../../${name}/package.json`);
  return (
    <p>
      {description}.{children}
    </p>
  );
};

export default PackageDescription;
