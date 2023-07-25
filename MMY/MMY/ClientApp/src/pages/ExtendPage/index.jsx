import { LinkOutlined } from '@ant-design/icons';
import { useParams } from '@umijs/max';
import { useRafState } from 'ahooks';
import { Button, Spin } from 'antd';
import { useEffect, useState } from 'react';
import Iframe from 'react-iframe';
import Config from '../../config/app';

const App = () => {
  const url = useParams();
  const { id } = url;
  const [state, setState] = useRafState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    function init() {
      const onResize = () => {
        setState({
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
        });
      };
      onResize();

      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
      };
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [loading, setLoading] = useState(true);

  const [lastId, setLastId] = useState('');
  useEffect(() => {
    if (lastId !== '' && id !== lastId) {
      setLoading(true);
    }
  }, [id, lastId]);

  const jumpUrl = Config.filter((item) => item.id === id)[0];
  return (
    <>
      <div style={{ position: 'fixed', right: 80, zIndex: 9, bottom: 50 }}>
        <Button
          icon={<LinkOutlined />}
          type="primary"
          onClick={() => {
            // 新窗口打开
            window.open(jumpUrl.url);
          }}
        >
          新窗口打开
        </Button>
      </div>
      <Spin spinning={loading}>
        <Iframe
          id="extend-page"
          url={jumpUrl.url}
          width="100%"
          height={`${state.height - 90}px`}
          // id="iframe"
          className=""
          sandbox={['allow-same-origin', 'allow-scripts']}
          display="block"
          position="relative"
          styles={{ border: 'none' }}
          allowFullScreen
          onLoad={() => {
            setLoading(false);
            setLastId(jumpUrl.id);
          }}
        />
      </Spin>
    </>
  );
};

export default App;
