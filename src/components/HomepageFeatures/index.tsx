import type {ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: 'homepage.features.modular.title',
      message: 'Modular applications',
      description: 'Title of the first homepage feature card',
    }),
    Svg: require('@site/static/img/easy.svg').default,
    description: translate({
      id: 'homepage.features.modular.description',
      message:
        'NethServer is a container orchestrator that lets you install and manage applications through a friendly web interface.',
      description: 'Description of the first homepage feature card',
    }),
  },
  {
    title: translate({
      id: 'homepage.features.cluster.title',
      message: 'Multi-node clusters',
      description: 'Title of the second homepage feature card',
    }),
    Svg: require('@site/static/img/cluster.svg').default,
    description: translate({
      id: 'homepage.features.cluster.description',
      message:
        'Host applications on a single machine or distribute the workload across multiple nodes, ready for the hybrid cloud.',
      description: 'Description of the second homepage feature card',
    }),
  },
  {
    title: translate({
      id: 'homepage.features.opensource.title',
      message: 'Open Source',
      description: 'Title of the third homepage feature card',
    }),
    Svg: require('@site/static/img/open_source.svg').default,
    description: translate({
      id: 'homepage.features.opensource.description',
      message: 'NethServer is Open Source with a vibrant community.',
      description: 'Description of the third homepage feature card',
    }),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
