import React from 'react';
import Footer from '@theme-original/DocItem/Footer';
import type FooterType from '@theme/DocItem/Footer';
import type { WrapperProps } from '@docusaurus/types';
import VersionFooter from '@site/src/components/VersionFooter';

type FooterProps = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: FooterProps): React.JSX.Element {
  return (
    <>
      <Footer {...props} />
      <VersionFooter />
    </>
  );
}
