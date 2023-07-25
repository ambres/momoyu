import { PageContainer } from '@ant-design/pro-components';
import { useOutlet, useRouteProps } from '@umijs/max';
import './index.less';
import styles from './index.less';

export default () => {
  const outlet = useOutlet();
  const routeProps = useRouteProps();
  if (routeProps.full) {
    return (
      <PageContainer breadcrumb={false} prefixCls={'jupiter-external-pages'} title={false}>
        {outlet}
      </PageContainer>
    );
  }
  return (
    <PageContainer prefixCls={'jupiter-external-pages'} title={false}>
      <div className={styles.outBox}>{outlet}</div>
    </PageContainer>
  );
};
