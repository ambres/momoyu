
import { useRequestHandle } from '@/utils/utils';
import { EditOutlined, ExclamationCircleOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProTable from '@ant-design/pro-table';
import { Button, Card, Col, Drawer, message, Modal, Popconfirm, Row, Space, Switch, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Access, useAccess } from 'umi';
import FixIcon from '../../../../components/FixIcon/FixIcon';
import AddAction from './components/AddAction';
import SaveForm from './components/SaveForm';
import operation from './operation';
import OperationList from './OperationList';
import {
  add,
  addOperation,
  get,
  getOperation,
  getTreeData,
  remove,
  removeOperation,
  statusChange,
  update,
  updateOperation,
  getHostApiAddress
} from './service';

const { confirm } = Modal;
const Menus = (props) => {
  const { applicationId } = props;
  const [saveModalVisible, handleModalVisible] = useState(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [addActionVisible, setAddActionVisible] = useState(false);
  const [operationListModalVisible, setOperationListModalVisible] = useState(false);
  const [hoverMenu, setHoverMenu] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isLoding, setIsLoading] = useState(false);
  const [checkId, setCheckId] = useState("");
  const [parentMenu, setParentMenu] = useState([]);
  const { canOperation, canShowOption } = useAccess();
  const [hostApiAddress, setHostApiAddress] = useState();
  const [isMenu, setIsMenu] = useState(true);
  // 是否显示操作列
  const isShowOptionColumn = canShowOption([operation.update, operation.delete]);

  // 读取数据列表
  const getTreeRequest = useRequestHandle(getTreeData, (data) => {
    const segmentdOptions = data.map(item => {
      return {
        value: item.id, label: item.name, icon: item.icon

      };
    });

    if (!checkId) {
      const defaultId = data.length > 0 ? data[0].id : 0;
      setCheckId(defaultId);
    }
    setParentMenu(segmentdOptions)
    setDataSource(data);
  });
  // 刷新
  const reload = () => {
    getTreeRequest.run({ applicationId });
  };
  // 新增
  const addRequest = useRequestHandle(add, () => {
    message.success('创建成功.');
    handleModalVisible(false);
    reload();
  });
  const addOperationRequest = useRequestHandle(addOperation, () => {
    message.success('操作成功.');
    setAddActionVisible(false);
    reload();
  });
  const updateOperationRequest = useRequestHandle(updateOperation, () => {
    message.success('操作成功.');
    setAddActionVisible(false);
    reload();
  });
  // 更新
  const updateRequest = useRequestHandle(update, () => {
    message.success('更新成功.');
    handleModalVisible(false);
    setUpdateFormValues({});
    reload();
  });
  // 删除
  const deleteRequest = useRequestHandle(remove, () => {
    message.success('删除成功.');
    reload();
  });
  // 状态变更
  const statusChangeRequest = useRequestHandle(statusChange, () => {
    message.success('操作成功.');
    reload();
  });

  // 删除操作
  const removeOperationRequest = useRequestHandle(removeOperation, () => {
    message.success('删除成功.');
    reload();
  });
  const getHostApiAddressRequest = useRequestHandle(getHostApiAddress, (data) => {
    setHostApiAddress(data)
  });
  const showDeleteConfirm = (id) => {
    confirm({
      title: '是否要删除',
      icon: <ExclamationCircleOutlined />,

      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        removeOperationRequest.run({ id });
      },
    });
  };
  const columns = [

    {
      title: '名称',
      dataIndex: 'name',
      fixed: 'left',
      ellipsis: true,
      render: (dom, entity) => <a onClick={() => setRow(entity)}>{dom}</a>,
      width: 120,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      fixed: 'left',
      ellipsis: true,
      render: (_, entity) => <FixIcon name={entity.icon} />,
      width: 120,
    },

    {
      title: '路由路径',
      dataIndex: 'path',
      hideInSearch: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      hideInSearch: true,
      width: 75,
    },
    {
      title: '功能点',
      dataIndex: 'name',
      hideInSearch: true,
      width: 200,
      render: (_, record) => (
        <Space wrap>
          {canOperation(operation.operationCreate) && (
            <Button
              style={{ fontSize: '12px' }}
              icon={<PlusOutlined style={{ fontSize: '12px' }} />}
              onClick={(e) => {
                setHoverMenu({ menuId: record.id });
                setAddActionVisible(true);
                e.stopPropagation();
              }}
              type="dashed"
              size="small"
            >
              添加
            </Button>
          )}

          {record.operations.map((value) => {

            return (
              <Tag
                style={{ cursor: 'pointer' }}
                onClick={async (e) => {
                  e.stopPropagation();
                  if (canOperation(operation.operationUpdate)) {
                    const result = await getOperation({ id: value.value });
                    if (!result.success) {
                      message.error(result.message);
                      return;
                    }
                    setHoverMenu({ ...result.data, opList: result.data.code.split(',') });
                    setAddActionVisible(true);
                  }
                }}
                closable={canOperation(operation.operationDelete)}
                onClose={(e) => {
                  showDeleteConfirm(value.value);
                  e.preventDefault();
                }}
                color="blue"
                key={value.value}
              >
                {value.label}
              </Tag>
            );
          })}

        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      width: 95,
      align: 'center',
      render: (_, record) => {
        const isChecked = record.status === 1;
        const canChangeStatus = canOperation(operation.statusChange);
        if (!canChangeStatus) {
          return isChecked ? <Tag color="#87d068">启用</Tag> : <Tag color="#f50">禁用</Tag>;
        }
        const title = isChecked ? '确定要禁用该数据吗？' : '确定要启用该数据吗？';
        return (
          <>
            <Popconfirm
              placement="top"
              title={title}
              onConfirm={(e) => {
                e.stopPropagation();
                statusChangeRequest.run({ id: record.id });
              }}
              okText="确定"
              cancelText="取消"
            >
              <Switch
                loading={statusChangeRequest.loading}
                checkedChildren="启用"
                unCheckedChildren="禁用"
                checked={isChecked}
              />
            </Popconfirm>
          </>
        );
      },
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'created',
    //   valueType: 'dateTime',
    //   width: 170,
    //   hideInSearch: true,
    //   hideInForm: true,
    // },
    {
      title: '修改时间',
      dataIndex: 'updated',
      valueType: 'dateTime',
      width: 170,
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      hideInTable: !isShowOptionColumn,
      width: 125,
      render: (_, record) => (
        <Space>
          <Access accessible={canOperation(operation.update)}>
            <Button
              type="primary"
              size="small"
              onClick={async (e) => {
                e.stopPropagation();
                const result = await get({ id: record.id });
                if (!result.success) {
                  message.error(result.message);
                  return;
                }
                setIsMenu(true);
                handleModalVisible(true);
                setUpdateFormValues(result.data);
              }}
            >
              编辑
            </Button>
          </Access>
          <Access accessible={canOperation(operation.delete)}>
            <Popconfirm
              placement="topRight"
              title={'确定要这条数据删除吗？'}
              onConfirm={(e) => {
                e.stopPropagation();
                deleteRequest.run({
                  id: record.id,
                });
              }}
              onCancel={(e) => {
                e.stopPropagation();
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="dashed"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                loading={deleteRequest.loading}
                danger
                size="small"
              >
                删除
              </Button>
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    if (!isLoding) {
      getTreeRequest.run({ applicationId });
      getHostApiAddressRequest.run({ appId: applicationId })
      setIsLoading(true);
    }
  }, [getTreeRequest, isLoding, applicationId, getHostApiAddressRequest]);


  const childSource = dataSource.filter(item => { return item.id === checkId });
  return (
    <>
      {hostApiAddress ? <div style={{ padding: "5px 0" }}>当前环境的应用Host地址：{hostApiAddress}</div>
        : <div style={{ padding: "5px 0", color: "red" }}>请先添加对应环境后，再进行功能点管理！</div>
      }
      <div style={{ padding: "5px 0" }}>
        <Button
          onClick={() => {
            handleModalVisible(true);
            setIsMenu(false)
          }}
          style={{ marginBottom: "10px" }} type='primary' ghost >添加模块</Button>
        <Row gutter={[4]} style={{ marginBottom: "10px" }}>
          {parentMenu.map((item) => {
            return <Col key={item.value} flex={'130px'}  >
              <Card
                style={checkId === item.value ? { background: "#fff" } : { background: "#f4f4f4" }}
                onClick={() => { setCheckId(item.value); }}
                size='small'
              >

                <div style={{ textAlign: "center", cursor: "pointer" }}>
                  <FixIcon name={item.icon} />  {item.label}
                  <EditOutlined
                    onClick={async (e) => {
                      e.stopPropagation();
                      const result = await get({ id: item.value });
                      if (!result.success) {
                        message.error(result.message);
                        return;
                      }
                      setIsMenu(false);
                      handleModalVisible(true);
                      setUpdateFormValues(result.data);
                    }}
                    style={{ marginLeft: "10px", cursor: "pointer" }}
                    type="primary" key="edit" />
                </div>


              </Card>
            </Col>
          })}
        </Row>

        {/* <Segmented value={checkId} options={parentMenu} onChange={(value) => {
          setCheckId(value);
        }} /> */}

      </div>
      {childSource.length > 0 ? (
        <ProTable
          key={'loadingTable'}
          headerTitle="菜单管理"
          defaultSize='small'
          actionRef={actionRef}
          rowKey="id"
          loading={getTreeRequest.loading}
          pagination={false}
          search={false}
          options={{
            fullScreen: true,
          }}
          toolBarRender={() => [
            <Access key="create" accessible={canOperation(operation.create)}>
              <Button type="primary" onClick={() => {
                handleModalVisible(true);
                setIsMenu(true)
              }}>
                <PlusOutlined /> 创建
              </Button>
            </Access>,
            <Access key="create" accessible={canOperation(operation.operationQuery)}>
              <Button
                key="operation-list"
                type="primary"
                onClick={() => setOperationListModalVisible(true)}
              >
                <FormOutlined /> 功能列表
              </Button>
            </Access>,
          ]}
          dataSource={childSource[0].children}
          postData={(data) => {
            return !data ? [] : data;
          }}

          columns={columns}
          rowSelection={false}
          expandable={{
            // expandRowByClick: true,
            defaultExpandAllRows: true,
          }}
        />
      ) : (
        <ProTable
          defaultSize='small'
          key={'emptyTable'}
          headerTitle="菜单管理"
          actionRef={actionRef}
          rowKey="id"
          loading={getTreeRequest.loading}
          pagination={false}
          search={false}
          options={{
            fullScreen: true,
          }}
          toolBarRender={() => [
            <Access key="create" accessible={canOperation(operation.create)}>
              <Button type="primary" onClick={() => handleModalVisible(true)}>
                <PlusOutlined /> 创建
              </Button>
            </Access>,
            <Access key="create" accessible={canOperation(operation.operationQuery)}>
              <Button
                key="operation-list"
                type="primary"
                onClick={() => setOperationListModalVisible(true)}
              >
                <FormOutlined /> 功能列表
              </Button>
            </Access>,
          ]}
          columns={columns}
          rowSelection={false}
          expandable={{
            expandRowByClick: true,
            defaultExpandAllRows: true,
          }}
        />
      )}
      <SaveForm
        onCancel={() => {
          handleModalVisible(false);
          setUpdateFormValues({});
        }}
        onSubmit={async (value) => {
          const data = value;
          data.applicationId = applicationId;
          data.status = value.status ? 1 : 0;
          if (data.id) {
            updateRequest.run(data);
          } else {
            addRequest.run(data);
          }
        }}
        isMenu={isMenu}
        moduleId={checkId}
        applicationId={applicationId}
        record={updateFormValues}
        loading={addRequest.loading || updateRequest.loading}
        modalVisible={saveModalVisible}
      />
      <AddAction
        onCancel={() => {
          setAddActionVisible(false);
          setHoverMenu({});
        }}
        onSubmit={(value) => {
          const data = value;
          if (data.id) {
            updateOperationRequest.run(data);
          } else {
            addOperationRequest.run(data);
          }
        }}
        hostApiAddress={hostApiAddress}
        record={hoverMenu}
        loading={addOperationRequest.loading || updateOperationRequest.loading}
        modalVisible={addActionVisible}
      />

      <OperationList
        hostApiAddress={hostApiAddress}
        applicationId={applicationId}
        modalVisible={operationListModalVisible}
        onCancel={() => {
          setOperationListModalVisible(false);
        }}
      />

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.id && (
          <ProDescriptions
            column={1}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.id,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </>
  );
};

export default Menus;
