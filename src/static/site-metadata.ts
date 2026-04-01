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
      name: 'Running Page',
      url: `${getBasePath()}/`,
    },
    {
      name: 'Workouts',
      url: `${getBasePath()}/workouts`,
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
