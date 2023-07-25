import { useRequestHandle } from '@/utils/utils';
import { DatabaseOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { useUpdateEffect } from '@umijs/hooks';
import { history } from '@umijs/max';
import { Avatar, Button, Card, Col, Empty, message, Row, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import AddApplication from './components/AddApplication';
import styles from './index.less';
import { add, getTest, initAdminRole, query, update } from './service';

const { Meta } = Card;

export default function Applications() {
  const [saveFormVisible, setSaveFormVisible] = useState(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const addRequest = useRequestHandle(add, () => {
    message.success('添加成功！');

    setSaveFormVisible(false);
    setPageSearch({
      pageIndex: 1,
      pageSize: 50,
    });
  });
  const updateRequest = useRequestHandle(update, () => {
    message.success('操作成功');
    setSaveFormVisible(false);
    setUpdateFormValues({});
    setPageSearch({
      pageIndex: 1,
      pageSize: 50,
    });
  });
  const initAdminRoleRequest = useRequestHandle(initAdminRole, () => {
    message.success('操作成功');
  });

  const [pageResult, setPageResult] = useState({
    currentPage: 1,
    items: [],
    itemsPerPage: 50,
    totalItems: 0,
    totalPages: 0,
  });
  const [pageSearch, setPageSearch] = useState({
    pageIndex: 1,
    pageSize: 50,
  });
  const [loading, setLoading] = useState(false);

  const getPageRequest = useRequestHandle(query, (data) => {
    setPageResult(data);
  });

  useUpdateEffect(() => {
    getPageRequest.run(pageSearch);
  }, [pageSearch]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const response = await query({ pageSize: 50, pageIndex: 1 });

      await getTest({});
      setLoading(false);
      if (response && response.success) {
        setPageResult(response.data);
      } else {
        message.error('获取应用列表失败！');
      }
    }
    init();
  }, []);
  return (
    <>
      <Spin spinning={loading || getPageRequest.loading}>
        <div className={styles.project}>
          <Row gutter={[12]} align="bottom">
            <Col>
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={() => {
                  setSaveFormVisible(true);
                  setUpdateFormValues({});
                }}
              >
                添加应用
              </Button>
              <Button
                type="primary"
                loading={initAdminRoleRequest.loading}
                onClick={() => {
                  initAdminRoleRequest.run({});
                }}
              >
                同步管理员权限
              </Button>
            </Col>
          </Row>
          {pageResult.items.length === 0 ? (
            <Empty style={{ marginTop: '100px' }} description={'暂无数据'} />
          ) : null}
          <Row style={{ marginBottom: '24px', marginTop: '12px' }} gutter={[24, 24]}>
            {pageResult.items.map((item) => {
              return (
                <Col key={item.id} flex={'300px'}>
                  <Card
                    // size='small'
                    actions={[
                      <SettingOutlined
                        key="setting"
                        onClick={() => {
                          history.push(`/system/applications/edit/${item.id}`);
                        }}
                      />,
                      <EditOutlined
                        key="edit"
                        onClick={() => {
                          setSaveFormVisible(true);
                          setUpdateFormValues(item);
                        }}
                      />,
                      <DatabaseOutlined
                        key="dbout"
                        onClick={() => {
                          history.push(`/system/applications/env/${item.id}`);
                        }}
                      />,
                    ]}
                  >
                    <Meta
                      avatar={
                        <Avatar size={52} style={{ backgroundColor: '#87d068' }}>
                          {item.applicationName}
                        </Avatar>
                      }
                      title={
                        <div>
                          {item.applicationName}
                          {item.applicationType === 2 ? (
                            <Tag style={{ marginLeft: '12px' }} color="pink">
                              公共系统
                            </Tag>
                          ) : (
                            <Tag style={{ marginLeft: '12px' }} color="blue">
                              业务系统
                            </Tag>
                          )}
                        </div>
                      }
                      description={item.applicationCode}
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>

        <AddApplication
          onSubmit={async (value) => {
            const params = Object.assign(value, { status: value.status ? 1 : 0 });
            if (params.id) {
              updateRequest.run(params);
            } else {
              addRequest.run(params);
            }
          }}
          onCancel={() => {
            setSaveFormVisible(false);
            setUpdateFormValues({});
          }}
          loading={false}
          modalVisible={saveFormVisible}
          record={updateFormValues}
        />
      </Spin>
    </>
  );
}
