import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '育儿夜吟',
    Svg: require('@site/static/img/dad-of-three.svg').default,
    description: (
      <>
        三宝闹腾驯兽忙，龙宝幺儿最逞强。
        <br />
        夜啼声中练佛心，深夜泡奶伴月光。
        <br />
        育儿日记添新页，岁月沧桑写担当。
        <br />
        披星戴月终不悔，父爱如山自巍昂。
      </>
    ),
  },
  {
    title: '代码咏怀',
    Svg: require('@site/static/img/app-developer.svg').default,
    description: (
      <>
        代码成诗指尖舞，Bug化蝶绕梁飞。
        <br />
        AI 辅佐思路开，咖啡续命战晨晖。
        <br />
        用户需求深挖掘，产品匠心永不违。
        <br />
        晨昏颠倒终不悔，技术巅峰勇攀登。
      </>
    ),
  },
  {
    title: '极客铭志',
    Svg: require('@site/static/img/digital-enthusiast.svg').default,
    description: (
      <>
        数码松鼠囤货忙，苹果设备映眸光。
        <br />
        树莓派下积灰厚，智能家居梦中藏。
        <br />
        新品尝鲜如猎豹，经典设备似老友。
        <br />
        科技之美心底狂，极客精神永流芳。
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
