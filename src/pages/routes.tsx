import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';

const RoutesPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>轨迹墙</title>
      </Helmet>
      <div className="border-white/8 w-full rounded-[28px] border bg-[#0d0d0f] px-8 py-14 text-white shadow-2xl shadow-black/30">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-5xl font-black tracking-[-0.06em] text-white">
            ROUTES
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-400">
            轨迹墙页面先占位，下一步我们按参考站样式把路线墙完整做出来。
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RoutesPage;
