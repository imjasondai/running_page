import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Index from './pages';
import NotFound from './pages/404';
import ReactGA from 'react-ga4';
import {
  GOOGLE_ANALYTICS_TRACKING_ID,
  USE_GOOGLE_ANALYTICS,
} from './utils/const';
import '@/styles/index.css';
import { withOptionalGAPageTracking } from './utils/trackRoute';
import HomePage from '@/pages/total';
import WorkoutsPage from '@/pages/workouts';
import RunningLifePage from '@/pages/running-life';
import RoutesPage from '@/pages/routes';
import HeatmapPage from '@/pages/heatmap';
import EventsPage from '@/pages/events';
import OriginalPage from '@/pages/original';

if (USE_GOOGLE_ANALYTICS) {
  ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_ID);
}

const routes = createBrowserRouter(
  [
    {
      path: '/',
      element: withOptionalGAPageTracking(<Index />),
    },
    {
      path: 'summary',
      element: withOptionalGAPageTracking(<HomePage />),
    },
    {
      path: 'workouts',
      element: withOptionalGAPageTracking(<WorkoutsPage />),
    },
    {
      path: 'routes',
      element: withOptionalGAPageTracking(<RoutesPage />),
    },
    {
      path: 'heatmap',
      element: withOptionalGAPageTracking(<HeatmapPage />),
    },
    {
      path: 'running-life',
      element: withOptionalGAPageTracking(<RunningLifePage />),
    },
    {
      path: 'events',
      element: withOptionalGAPageTracking(<EventsPage />),
    },
    {
      path: 'original',
      element: withOptionalGAPageTracking(<OriginalPage />),
    },
    {
      path: '*',
      element: withOptionalGAPageTracking(<NotFound />),
    },
  ],
  { basename: import.meta.env.BASE_URL }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={routes} />
    </HelmetProvider>
  </React.StrictMode>
);
