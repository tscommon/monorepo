import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React, { type ReactNode } from 'react';

interface CodeFile {
  label?: string;
  value: string;
  default?: boolean;
  title: string;
  path: string;
  children?: ReactNode;
}

interface CodeUsageProps {
  groupId: string;
  module: string;
  files: CodeFile[];
}

function resolvePath(str: string, module: string): string {
  if ('../' === str.substring(0, 3)) {
    return `@tscommon/${module}`;
  }
  return str;
}

function patchImports(str: string, module: string): string {
  return str.replace(/from '([^']+)';/g, (_, path: string) => {
    const resolvedPath = resolvePath(path, module);
    return `from '${resolvedPath}';`;
  });
}

const CodeUsage: React.FC<React.PropsWithChildren<CodeUsageProps>> = ({ groupId, module, files }) => {
  const blocks = files.map((file: CodeFile, index) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: content } = require(`!!raw-loader!../../../${module}/${file.path}`) as { default: string };
    const code = (
      <CodeBlock key={index} language="ts" showLineNumbers title={file.title}>
        {patchImports(content, module)}
      </CodeBlock>
    );
    if (files.length === 1) {
      return code;
    }
    return (
      <TabItem key={index} label={file.label} value={file.value} default={file.default}>
        {file.children}
        {code}
      </TabItem>
    );
  });
  if (blocks.length === 1) {
    return blocks[0];
  }
  return (
    <Tabs groupId={groupId} queryString>
      {blocks}
    </Tabs>
  );
};

export default CodeUsage;
