/* eslint-disable @typescript-eslint/no-require-imports */

import React from 'react';

interface PackageDescriptionProps {
  name: string;
}

const PackageDescription: React.FC<React.PropsWithChildren<PackageDescriptionProps>> = ({ name, children }) => {
  const { description } = require(`../../../${name}/package.json`);
  return (
    <p>
      {description}.{children}
    </p>
  );
};

export default PackageDescription;
