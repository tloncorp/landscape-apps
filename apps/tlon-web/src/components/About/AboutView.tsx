import { Helmet } from 'react-helmet';

import { useIsMobile } from '@/logic/useMedia';
import { ViewProps } from '@/types/groups';

import Layout from '../Layout/Layout';
import MobileHeader from '../MobileHeader';
import About from './About';

export default function AboutView({ title }: ViewProps) {
  const isMobile = useIsMobile();

  return (
    <Layout
      header={
        isMobile ? <MobileHeader title="About" pathBack="/profile" /> : null
      }
      className="flex-1"
    >
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="overflow-y-scroll px-6 pt-8">
        <About />
      </div>
    </Layout>
  );
}
