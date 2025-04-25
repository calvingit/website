import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import BackgroudImage from '@site/static/img/undraw_programming.svg';

import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className='container'>
        <div className={styles.headerSection}>
          <Welcome />
          <BackgroudImage className={styles.backgroundImage} role='img' />
        </div>
      </div>
    </header>
  );
}

function Welcome() {
  return (
    <div>
      <Heading as='h1' className='hero__title'>
        嗨，我是张文 🌟
      </Heading>
      <div>
        <p className='hero__subtitle'>热爱技术，热爱创造，欢迎来到我的数字花园！🌱</p>
        <p>这里是我探索移动应用编程世界的一方天地，从原生到跨平台，记录每一步成长。📱</p>
        <p>在这个 AI 与创新交织的时代，让我们一起拥抱变化，突破边界！💡</p>
        <p>无论你是初学者还是老手，都能在这里找到属于自己的启发。✨</p>
      </div>
      <div className={styles.buttons}>
        <Link className='button button--primary button--lg' to='/blog'>
          开启探索
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description='Description will go into a meta tag in <head />'>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
