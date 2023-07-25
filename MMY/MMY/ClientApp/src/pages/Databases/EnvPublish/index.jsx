import { useRequestHandle } from '@/utils/utils';
import { SyncOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { useUpdateEffect } from '@umijs/hooks';
import { useAccess, useMatch } from '@umijs/max';
import { Button, Col, Divider, Drawer, message, Modal, Row, Segmented, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import operation from './operation';
import {
  getAllEnvCode,
  getChangeAppTables,
  getVersionList,
  rollbackTableVersion,
  initOrUpdateDatabase,
} from './service';

const Env = () => {
  const match = useMatch('system/applications/env/:id');
  const [envCodelist, setEnvCodeList] = useState([]);
  const [hoverCode, setHoverCode] = useState('');
  const [saveFormVisible, setSaveFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [versionList, setVersionList] = useState([]);
  const [showChange, setShowChange] = useState(false);
  const [confirmVisable, setConfirmVisable] = useState(false);
  const [hoverAppId, setHoverAppId] = useState('');
  const [changeItem, setChangeItem] = useState({ items: [] });
  const actionRef = useRef();
  const { canShowOption } = useAccess();
  // 是否显示操作列
  const isShowOptionColumn = canShowOption([
    operation.update,
    operation.delete,
    operation.assignPermissions,
  ]);

  const getVersionListRequest = useRequestHandle(getVersionList, (data) => {
    setDataList(data);
  });
  const initOrUpdateDatabaseRequest = useRequestHandle(initOrUpdateDatabase, () => {
    message.success('操作成功');
    setChangeItem({ items: [] });
    setShowChange(false);
    getVersionListRequest.run({ environment: hoverCode, applicationId: match.params.id });
  });
  const getChangeAppTablesRequest = useRequestHandle(getChangeAppTables, (data) => {
    // console.log(data);
    setVersionList(data);
  });
  const rollbackTableVersionRequest = useRequestHandle(rollbackTableVersion, () => {
    message.success('操作成功');
    setHoverAppId('');
    setConfirmVisable(false);
    getVersionListRequest.run({ environment: hoverCode, applicationId: match.params.id });
  });

  useEffect(() => {
    async function init() {
      const response = await getAllEnvCode();
      if (response && response.success) {
        setEnvCodeList(response.data);
        if (response.data.length > 0) {
          setHoverCode(response.data[0]);
        }
      } else {
        message.error('获取环境变量Code失败');
      }
    }
    init();
  }, []);
  useUpdateEffect(() => {
    if (hoverCode) {
      getVersionListRequest.run({ environment: hoverCode, applicationId: match.params.id });
    }
  }, [hoverCode]);
  useUpdateEffect(() => {
    if (dataList.length > 0) {
      const appIds = dataList
        .map((c) => {
          return c.enterpriseApplicationVersionId;
        })
        .toString();
      getChangeAppTablesRequest.run({ appIds });
    }
  }, [dataList]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      fixed: 'left',
      width: 75,
    },
    {
      title: '企业',
      dataIndex: 'enterpriseName',
      ellipsis: true,
      fixed: 'left',
      width: 170,
    },
    {
      title: '应用信息',
      dataIndex: 'applicationName',
      ellipsis: true,
    },
    {
      title: '版本',
      dataIndex: 'versionName',
      ellipsis: true,
    },
    {
      title: '最后更新时间',
      dataIndex: 'lastSyncTime',
      ellipsis: true,
      render: (_, item) => {
        const version = versionList.filter((c) => {
          return c.appId === item.enterpriseApplicationVersionId;
        });
        if (version.length === 0) {
          return '-';
        }
        return version[0].updateTime;
      },
    },
    {
      title: '数据库状态',
      dataIndex: 'lastSyncTime',
      ellipsis: true,
      render: (_, item) => {
        const version = versionList.filter((c) => {
          return c.appId === item.enterpriseApplicationVersionId;
        });
        if (version.length === 0) {
          return '未同步';
        }
        return version[0].items.length > 0 ? (
          <span
            onClick={() => {
              setShowChange(true);
              setChangeItem(version[0]);
            }}
            style={{ color: 'red', cursor: 'pointer' }}
          >
            有更新({version[0].items.length})
          </span>
        ) : (
          <span style={{ color: 'green' }}>最新</span>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      hideInTable: !isShowOptionColumn,
      width: 135,
      render: (_, record) => {
        const version = versionList.filter((c) => {
          return c.appId === record.enterpriseApplicationVersionId;
        });

        return (
          <Space>
            <Button
              type="primary"
              size="small"
              disabled={
                version.length !== 0 ? false : version.length !== 0 && version[0].items.length === 0
              }
              loading={initOrUpdateDatabaseRequest.loading}
              onClick={async () => {
                if (version.length === 0) {
                  initOrUpdateDatabaseRequest.run({
                    enterpriseApplicationVersionId: record.enterpriseApplicationVersionId,

                  });
                } else {
                  if (version[0].items.length === 0) {
                    message.success('更新成功！');
                  } else {
                    setShowChange(true);
                    setChangeItem(version[0]);
                  }
                }
              }}
            >
              {version.length === 0 ? '初始化' : '更新'}
            </Button>
            <Button
              type="primary"
              danger
              size="small"
              loading={rollbackTableVersionRequest.loading}
              onClick={async () => {
                setConfirmVisable(true);
                setHoverAppId(record.enterpriseApplicationVersionId);
              }}
            >
              回退
            </Button>
          </Space>
        );
      },
    },
  ];
  return (
    <>
      <div>
        <div style={{ margin: '0 10px 10px' }}>环境（ENV）</div>
        <Segmented
          value={hoverCode}
          onChange={(value) => {
            setHoverCode(value);
          }}
          options={envCodelist}
        />
      </div>

      <Divider />

      <ProTable
        headerTitle="应用列表"
        actionRef={actionRef}
        rowKey="enterpriseApplicationVersionId"
        search={false}
        toolBarRender={() => [
          <Button key={'allsync'} type="primary" onClick={() => setSaveFormVisible(true)}>
            <SyncOutlined /> 全部更新
          </Button>,
        ]}
        dataSource={dataList}
        loading={getVersionListRequest.loading}
        columns={columns}
        rowSelection={false}
        expandable={{ defaultExpandAllRows: true }}
      />

      <Drawer
        width={600}
        open={saveFormVisible}
        onClose={() => {
          setSaveFormVisible(false);
        }}
      >
        <Button
          size="small"
          loading={loading}
          type="primary"
          onClick={() => {
            const oldDataList = dataList;
            let newDataList = dataList;
            setLoading(true);
            oldDataList.forEach(async (item) => {
              const response = await initOrUpdateDatabase({
                enterpriseApplicationVersionId: item.enterpriseApplicationVersionId,

              });
              item.isHandler = true;
              if (response && response.success) {
                item.success = true;
                item.message = '操作成功';
              } else {
                item.success = false;
                item.message = response.message;
              }
              newDataList = newDataList.map((c) => {
                if (c.enterpriseApplicationVersionId === item.enterpriseApplicationVersionId) {
                  return item;
                }
                return c;
              });
              if (
                newDataList.filter((c) => {
                  return !c.isHandler;
                }).length === 0
              ) {
                setLoading(false);
              }
              setDataList(newDataList);
            });

            // setSaveFormVisible(false);
          }}
        >
          <SyncOutlined /> 全部更新
        </Button>
        <Divider style={{ margin: '5px 0' }} />

        {dataList.map((item) => {
          const tableChange = versionList.filter((c) => {
            return c.appId === item.enterpriseApplicationVersionId;
          });

          if (tableChange.length === 0 || tableChange[0].items.length === 0) {
            return null;
          }
          return (
            <>
              <h4>
                {' '}
                <span
                  style={{
                    color: item.isHandler ? 'green' : 'red',
                    fontWeight: '400',
                    marginRight: '20px',
                  }}
                >
                  {item.isHandler ? '已操作' : '未操作'}
                </span>
                {item.enterpriseName}-{item.applicationName}-{item.versionName}
              </h4>
              <Divider style={{ margin: '5px 0' }} />
              <Row>
                {' '}
                {tableChange[0].items.map((citem) => {
                  return (
                    <>
                      <Col span={24}>模型映射：{citem.className}</Col>
                      <Col span={24}>表名映射：{citem.mapTableName}</Col>
                      <Col span={24}>模型标识：{citem.typeGuid}</Col>
                      <Col span={24}>
                        变更标识：{citem.lastStringHash}-{'>'}
                        {citem.stringHash}
                      </Col>

                      {citem.addFieldNames.length > 0 ? (
                        <Col span={24}>
                          <Row>
                            <Col>新增字段：</Col>
                            {citem.addFieldNames.map((c) => {
                              return (
                                <Col
                                  style={{
                                    borderBottom: '1px solid #1890ff',
                                    paddingBottom: '2px',
                                    marginRight: '5px',
                                  }}
                                  key={c}
                                >
                                  <span style={{ color: '#1890ff' }}>[{c.split(',')[1]}]</span>
                                  <span>-{c.split(',')[0]}</span>
                                </Col>
                              );
                            })}
                          </Row>
                        </Col>
                      ) : null}
                      {citem.deleteFieldNames.length > 0 ? (
                        <Col span={24}>
                          <Row>
                            <Col>删除字段：</Col>
                            {citem.deleteFieldNames.map((c) => {
                              return (
                                <Col
                                  style={{
                                    borderBottom: '1px solid #1890ff',
                                    paddingBottom: '2px',
                                    marginRight: '5px',
                                  }}
                                  key={c}
                                >
                                  <span style={{ color: '#1890ff' }}>[{c.split(',')[1]}]</span>
                                  <span>-{c.split(',')[0]}</span>
                                </Col>
                              );
                            })}
                          </Row>
                        </Col>
                      ) : null}

                      <Divider style={{ margin: '5px 0' }} />
                    </>
                  );
                })}
              </Row>

              <Divider style={{ margin: '10px 0' }} />
            </>
          );
        })}
      </Drawer>

      <Drawer
        width={600}
        open={showChange}
        onClose={() => {
          setShowChange(false);
          setChangeItem({ items: [] });
        }}
      >
        <Button
          size="small"
          loading={initOrUpdateDatabaseRequest.loading}
          type="primary"
          onClick={() => {
            initOrUpdateDatabaseRequest.run({
              enterpriseApplicationVersionId: changeItem.appId
            });
          }}
        >
          <SyncOutlined /> 更新
        </Button>
        <Divider style={{ margin: '5px 0' }} />
        <Row>
          {changeItem.items.map((item) => {
            return (
              <>
                <Col span={24}>模型映射：{item.className}</Col>
                <Col span={24}>表名映射：{item.mapTableName}</Col>
                <Col span={24}>模型标识：{item.typeGuid}</Col>
                <Col span={24}>
                  变更标识：{item.lastStringHash}-{'>'}
                  {item.stringHash}
                </Col>

                {item.addFieldNames.length > 0 ? (
                  <Col span={24}>
                    <Row>
                      <Col>新增字段：</Col>
                      {item.addFieldNames.map((c) => {
                        return (
                          <Col
                            style={{
                              borderBottom: '1px solid #1890ff',
                              paddingBottom: '2px',
                              marginRight: '5px',
                            }}
                            key={c}
                          >
                            <span style={{ color: '#1890ff' }}>[{c.split(',')[1]}]</span>
                            <span>-{c.split(',')[0]}</span>
                          </Col>
                        );
                      })}
                    </Row>
                  </Col>
                ) : null}
                {item.deleteFieldNames.length > 0 ? (
                  <Col span={24}>
                    <Row>
                      <Col>删除字段：</Col>
                      {item.deleteFieldNames.map((c) => {
                        return (
                          <Col
                            style={{
                              borderBottom: '1px solid #1890ff',
                              paddingBottom: '2px',
                              marginRight: '5px',
                            }}
                            key={c}
                          >
                            <span style={{ color: '#1890ff' }}>[{c.split(',')[1]}]</span>
                            <span>-{c.split(',')[0]}</span>
                          </Col>
                        );
                      })}
                    </Row>
                  </Col>
                ) : null}

                <Divider style={{ margin: '5px 0' }} />
              </>
            );
          })}
        </Row>
      </Drawer>

      <Modal
        title="回滚确认"
        open={confirmVisable}
        okButtonProps={{ loading: rollbackTableVersionRequest.loading }}
        onOk={() => {
          rollbackTableVersionRequest.run({ appId: hoverAppId });
        }}
        onCancel={() => {
          setConfirmVisable(false);
          setHoverAppId('');
        }}
      >
        <p>此操作并不会改变数据库结构，只是回滚到上一个版本。</p>
        <p>
          回滚后，会显示上一个版本的更改，点击更新即可重新更新变更的结构！（实际以数据库当前结构和当前模型为准）
        </p>
      </Modal>
    </>
  );
};

export default Env;
