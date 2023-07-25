
import { SettingDrawer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { HomeOutlined } from '@ant-design/icons';
import logo from './assets/icon.png';
import ExtendApp from './components/RightContent/ExtendApp';
import config from './config';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
 
  return {
    settings: defaultSettings,
  };
}






// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout = ({ initialState, setInitialState }) => {
  return {
    bgLayoutImgList: [
      {
        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    actionsRender: () => [<ExtendApp key="extendapp" />],

    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    logo: initialState?.app?.logo ? `${config.cdnAddress}/${initialState?.app?.logo}` : logo,
    title: initialState?.app?.appName ? initialState?.app?.appName : '墨鱼',

    onPageChange: () => {

    },

    links: [],
    breadcrumbRender: (routers = []) => {
      const breadRouters = routers.map((c) => {
        return { title: c.breadcrumbName, name: c.breadcrumbName, to: c.path };
      });
      return [
        {
          to: '/',
          title: <HomeOutlined />,
          name: <HomeOutlined />,
        },
        ...breadRouters,
      ];
    },
    // pageTitleRender: false,
    breadcrumbProps: {
      itemRender: (route) => {
        return (
          <a
            onClick={() => {
              history.replace(route.to);
            }}
          >
            {route.title}
          </a>
        );
      },
    },

    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

