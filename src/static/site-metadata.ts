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
  siteTitle: 'imjasondai Running',
  siteUrl: 'https://imjasondai.github.io/running_page',
  logo: 'https://github.com/imjasondai.png',
  description: 'Personal running page powered by Strava',
  navLinks: [
    {
      name: 'Summary',
      url: `${getBasePath()}/summary`,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/imjasondai/running_page',
    },
    {
      name: 'About',
      url: 'https://github.com/imjasondai/running_page/blob/master/STRAVA_SETUP_CN.md',
    },
  ],
};

export default data;
