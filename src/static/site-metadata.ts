interface ISiteMetadataResult {
  siteTitle: string;
  siteUrl: string;
  description: string;
  logo: string;
  navLinks: {
    name: string;
    url: string;
  }[];
}

const getBasePath = () => {
  const baseUrl = import.meta.env.BASE_URL;
  return baseUrl === '/' ? '' : baseUrl;
};

const data: ISiteMetadataResult = {
  siteTitle: 'DvorakD Running',
  siteUrl: 'https://run.dvorakd.com',
  logo: 'https://github.com/imjasondai.png',
  description: 'DvorakD personal running page powered by Strava',
  navLinks: [
    {
      name: '首页',
      url: `${getBasePath()}/`,
    },
    {
      name: '轨迹墙',
      url: `${getBasePath()}/routes`,
    },
    {
      name: '热力图',
      url: `${getBasePath()}/heatmap`,
    },
    {
      name: '奔跑人生',
      url: `${getBasePath()}/running-life`,
    },
    {
      name: '赛事记录',
      url: `${getBasePath()}/events`,
    },
  ],
};

export default data;
