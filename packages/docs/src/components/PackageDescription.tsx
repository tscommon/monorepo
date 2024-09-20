import React from 'react';

interface PackageDescriptionProps {
  name: string;
}

const PackageDescription: React.FC<React.PropsWithChildren<PackageDescriptionProps>> = ({ name }) => {
  const { description } = require(`../../../${name}/package.json`);
  return <p>{description}.</p>;
};

export default PackageDescription;
