/* eslint-disable @typescript-eslint/no-require-imports */

import React, { type ReactNode } from 'react';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

interface CodeFile {
  label?: string;
  value?: string;
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
  return str.replace(/from '([^']+)';/g, (_, path) => {
    const resolvedPath = resolvePath(path, module);
    return `from '${resolvedPath}';`;
  });
}

const CodeUsage: React.FC<React.PropsWithChildren<CodeUsageProps>> = ({ groupId, module, files }) => {
  const blocks = files.map((file: CodeFile, index) => {
    const { default: content } = require(`!!raw-loader!../../../${module}/${file.path}`);
    const code = (
      <CodeBlock key={index} language="ts" showLineNumbers title={file.title ?? 'main.ts'}>
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
