import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

interface InstallSectionProps {
  name: string;
}

export const InstallSection: React.FC<InstallSectionProps> = ({ name }) => {
  return (
    <Tabs>
      <TabItem value="npm" label="npm" default>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm"
        >
          npm
        </a>{' '}
        is the default package manager for{' '}
        <a target="_blank" rel="noopener noreferrer" href="https://nodejs.org">
          Node.js
        </a>
        , and to where tscommon is published.
        <br />
        Your project is using npm if it has a <code>package-lock.json</code> file in its root folder.
        <br />
        <br />
        <strong>Run the following command in your terminal:</strong>
        <br />
        <br />
        <CodeBlock language="shell" title="terminal">
          npm install @tscommon/{name}
        </CodeBlock>
      </TabItem>

      <TabItem value="yarn" label="yarn" default>
        <a target="_blank" rel="noopener noreferrer" href="https://yarnpkg.com">
          yarn
        </a>{' '}
        is a fast, reliable and secure dependency manager for{' '}
        <a target="_blank" rel="noopener noreferrer" href="https://nodejs.org">
          Node.js
        </a>
        .
        <br />
        Your project is using Yarn if it has a <code>yarn.lock</code> file in its root folder.
        <br />
        <br />
        <strong>Run the following command in your terminal:</strong>
        <br />
        <br />
        <CodeBlock language="shell" title="terminal">
          yarn add @tscommon/{name}
        </CodeBlock>
      </TabItem>

      <TabItem value="pnpm" label="pnpm" default>
        <a target="_blank" rel="noopener noreferrer" href="https://pnpm.io/installation">
          pnpm
        </a>{' '}
        is a fast, disk space efficient package manager for{' '}
        <a target="_blank" rel="noopener noreferrer" href="https://nodejs.org">
          Node.js
        </a>
        .
        <br />
        Your project is using pnpm if it has a <code>pnpm-lock.yaml</code> file in its root folder.
        <br />
        <br />
        <strong>Run the following command in your terminal:</strong>
        <br />
        <br />
        <CodeBlock language="shell" title="terminal">
          pnpm add @tscommon/{name}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
};

export default InstallSection;
