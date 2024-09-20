import React from 'react';
import CodeBlock from '@theme/CodeBlock';

interface UsageSectionProps {
  name: string;
  usage: string;
  file?: string;
}

const UsageSection: React.FC<React.PropsWithChildren<UsageSectionProps>> = ({ name, children, file = 'index.ts' }) => {
  const { default: code } = require(`!!raw-loader!../../../${name}/examples/${file}`);
  return (
    <>
      {children}
      <CodeBlock language="ts" title="Usage">
        {code.replace('../src', `@tscommon/${name}`)}
      </CodeBlock>
    </>
  );
};

export default UsageSection;
