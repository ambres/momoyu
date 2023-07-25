import { AppstoreTwoTone, MenuOutlined, ThunderboltTwoTone } from '@ant-design/icons';
import { Tabs } from 'antd';
import { useState } from 'react';
import { useMatch } from 'umi';
import EnvManage from './EnvManage';
import MenuManage from './MenuManage';
import VersionManage from './VersionManage';

const Application = () => {
  const match = useMatch({ path: 'system/applications/edit/:id' });
  const [selectKey, setSelectKey] = useState('3');

  const applicationId = match.params.id;

  return (
    <>
      <Tabs
        activeKey={selectKey}
        items={[
          {
            key: '3',
            label: (
              <span>
                <AppstoreTwoTone />
                环境（ENV）
              </span>
            ),
          },
          {
            key: '1',
            label: (
              <span>
                <MenuOutlined />
                菜单（Menu）
              </span>
            ),
          },
          {
            key: '2',
            label: (
              <span>
                <ThunderboltTwoTone />
                版本（Version）
              </span>
            ),
          },
        ]}
        onChange={(key) => {
          setSelectKey(key);
        }}
      />
      {selectKey === '1' ? <MenuManage applicationId={applicationId} /> : null}
      {selectKey === '2' ? <VersionManage applicationId={applicationId} /> : null}
      {selectKey === '3' ? <EnvManage applicationId={applicationId} /> : null}
    </>
  );
};

export default Application;
