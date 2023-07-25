import { AppstoreOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Card, Col, Popover, Row } from 'antd';
import { useState } from 'react';
import appList from '../../config/app';

export default () => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      placement="bottom"
      title={false}
      content={
        <>
          <div style={{ padding: '0 10px', fontWeight: 'bolder' }}>其他页面：</div>
          <Row style={{ width: '300px' }}>
            {' '}
            {appList.map((enter) => {
              return (
                <Col key={enter.id}>
                  {' '}
                  <Card
                    size="small"
                    bordered={false}
                    style={{ margin: '10px', cursor: 'pointer' }}
                    onClick={() => {
                      // return;
                      if (enter.target === 'blank') {
                        window.open(enter.url);
                      } else {
                        history.push(`/extendpage/${enter.id}`);
                      }
                    }}
                  >
                    <div style={{ fontSize: '14px', color: 'black', fontWeight: 'bold' }}>
                      {enter.title}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      }
      onOpenChange={(e) => {
        setOpen(e);
      }}
      trigger={'click'}
    >
      <AppstoreOutlined style={{ margin: "0 20px" }} />
    </Popover>
  );
};
