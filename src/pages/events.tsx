import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';

const EventsPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>赛事记录</title>
      </Helmet>
      <div className="border-white/8 w-full rounded-[28px] border bg-[#0d0d0f] px-8 py-14 text-white shadow-2xl shadow-black/30">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-5xl font-black tracking-[-0.06em] text-white">
            EVENTS
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-400">
            赛事记录页面已经挂好入口，后面我们可以再照参考站把详情结构做出来。
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default EventsPage;
