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
        你好 👋 我是文
      </Heading>
      <div>
        <p className='hero__subtitle'>欢迎来到我的技术乐园! 🎡 </p>
        <p>在这里, 你会看到我对App原生、跨平台开发的总结笔记。 💭</p>
        <p>在这里, 你会看到我对App原生、跨平台开发的总结笔记。 💭</p>
        <p>我会不定期分享我在工作中遇到的各种"槽点"和"神器"。🧠</p>
        <p>让我们一起在这个瞬息万变的 AI 世界里学习、成长、创新吧!🚀</p>
        <p>祝你在这里读得开心, 玩得开心! 🥳</p>
      </div>
      <div className={styles.buttons}>
        <Link className='button button--primary button--lg' to='/blog'>
          Explore
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
