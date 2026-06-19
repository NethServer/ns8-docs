import type {ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const homepageTitle = translate({
    id: 'homepage.hero.title',
    message: 'NethServer 8 documentation',
    description: 'The title shown in the home page hero',
  });
  const homepageTagline = translate({
    id: 'homepage.hero.tagline',
    message: 'NethServer 8 is an application server designed for small offices and medium enterprises',
    description: 'The tagline shown in the home page hero',
  });
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {homepageTitle}
        </Heading>
        <p className="hero__subtitle">{homepageTagline}</p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const homepageTitle = translate({
    id: 'homepage.hero.title',
    message: 'NethServer 8 documentation',
    description: 'The title shown in the home page hero',
  });
  return (
    <Layout
      title={homepageTitle}
      description={translate({
        id: 'homepage.meta.description',
        message: 'NethServer 8 documentation',
        description: 'The meta description of the home page',
      })}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
