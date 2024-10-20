import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '三个娃奶爸',
    Svg: require('@site/static/img/dad-of-three.svg').default,
    description: (
      <>
        三个熊孩子的驯兽师 🎪, 老三是个小宝龙🦕
        <br />
        家庭CEO, 专职调解"玩具分配"矛盾 🧸
        <br />
        睡眠是什么? 我只知道深夜泡奶行动 🦉💤
      </>
    ),
  },
  {
    title: 'App开发狂',
    Svg: require('@site/static/img/app-developer.svg').default,
    description: (
      <>
        代码成瘾患者, 移动应用造梦师 📱✨
        <br />
        批量Bug制造者, 用户体验强迫症 🐛🔫
        <br />
        AI 编程使用冠军, 咖啡续命大师 ☕️💻
        <br />
      </>
    ),
  },
  {
    title: '数码狂热者',
    Svg: require('@site/static/img/digital-enthusiast.svg').default,
    description: (
      <>
        科技界的松鼠🐿️, 囤积各种电子设备⌚️💻
        <br />
        智能家居梦想家, 树莓派终极吃灰家 🏠🗣️
        <br />
        妻子眼中的"useless gadgets"收藏家 🤖🙄
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
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

export default function HomepageFeatures() {
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
