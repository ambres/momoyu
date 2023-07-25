import { getSorter, useRequestHandle } from '@/utils/utils';
import {
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  SendOutlined,
} from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProTable from '@ant-design/pro-table';
import {
  Button,
  Drawer,
  Dropdown,
  Menu,
  message,
  Space,
} from 'antd';
import { useRef, useState } from 'react';
import { Access, useAccess } from 'umi';
import PermissionAssignment from './components/PermissionAssignment';
import SaveForm from './components/SaveForm';
import operation from './operation';
import { add, get, query, update } from './service';

const Versions = (props) => {
  const { applicationId } = props;
  const [saveFormVisible, setSaveFormVisible] = useState(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [distributionVisible, setDistributionVisible] = useState(false);
  const [distributionValue, setDistributionValue] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const { canOperation, canShowOption, canShowMoreOption } = useAccess();
  // 是否显示操作列
  const isShowOptionColumn = canShowOption([
    operation.update,
    operation.delete,
    operation.assignPermissions,
  ]);
  // 是否显示更多操作列
  const isShowMoreOptionColumn = canShowMoreOption([operation.delete, operation.assignPermissions]);

  // 刷新
  const reload = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  // 新增
  const addRequest = useRequestHandle(add, () => {
    message.success('创建成功.');
    setSaveFormVisible(false);
    reload();
  });
  // 更新
  const updateRequest = useRequestHandle(update, () => {
    message.success('更新成功.');
    setSaveFormVisible(false);
    setUpdateFormValues({});
    reload();
  });


  // 操作-更多处理
  const moreOptionHandle = (key, record) => {
    switch (key) {

      case 'assign-permissions':
        setDistributionVisible(true);
        setDistributionValue({ id: record.id, applicationId: record.applicationId });
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      fixed: 'left',
      width: 75,
    },
    {
      title: '版本名称',
      dataIndex: 'versionName',
      ellipsis: true,
      render: (dom, entity) => <a onClick={() => setRow(entity)}>{dom}</a>,
      fixed: 'left',
      width: 170,
    },
    {
      title: '默认路由',
      dataIndex: 'defaultRoute',
      ellipsis: true,
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      hideInTable: !isShowOptionColumn,
      width: 135,
      render: (_, record) => (
        <Space>
          <Access accessible={canOperation(operation.update)}>
            <Button
              type="primary"
              size="small"
              onClick={async () => {
                const result = await get({ id: record.id });
                if (!result.success) {
                  message.error(result.message);
                  return;
                }
                setSaveFormVisible(true);
                setUpdateFormValues(result.data);
              }}
            >
              编辑
            </Button>
          </Access>
          <Access accessible={isShowMoreOptionColumn}>
            <Dropdown
              overlay={
                <Menu
                  onClick={(e) => {
                    moreOptionHandle(e.key, record);
                  }}
                  items={[
                    {
                      key: "assign-permissions",
                      icon: <SendOutlined />,
                      label: "分配权限",
                      disabled: !canOperation(operation.assignPermissions)
                    },
                    {
                      key: "delete",
                      icon: <DeleteOutlined />,
                      label: "删除",
                      disabled: !canOperation(operation.delete)
                    }
                  ]}
                />
              }
            >
              <Button size="small">
                更多 <DownOutlined />
              </Button>
            </Dropdown>
          </Access>
        </Space>
      ),
    },
  ];
  return (
    <>
      <ProTable
        headerTitle="版本列表"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        options={{
          search: canOperation(operation.query)
            ? {
              placeholder: '请输入关键字',
            }
            : false,
          fullScreen: true,
        }}
        toolBarRender={() => [
          <Access key="create" accessible={canOperation(operation.create)}>
            <Button type="primary" onClick={() => setSaveFormVisible(true)}>
              <PlusOutlined /> 创建
            </Button>
          </Access>,

        ]}
        request={async (params, sorter, filter) => {
          const data = params;
          data.pageIndex = params.current;
          data.applicationId = applicationId;
          const result = await query({ ...data, ...getSorter(sorter), filter });
          if (result.success) {
            return {
              ...result,
              total: result.data.totalItems,
            };
          }
          return [];
        }}
        postData={(data) => {
          return !data ? [] : data.items;
        }}
        // scroll={{
        //   x: 1200,
        // }}
        columns={columns}
        rowSelection={false}
        expandable={{ defaultExpandAllRows: true }}
      />

      <SaveForm
        onSubmit={async (value) => {
          const params = Object.assign(value, { status: value.status ? 1 : 0 });
          params.applicationId = applicationId;
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
        loading={updateRequest.loading || addRequest.loading}
        modalVisible={saveFormVisible}
        record={updateFormValues}
      />

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.id && (
          <ProDescriptions
            column={2}
            title={row?.realName}
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

      {/* <DistributionMenu
        onCancel={() => {
          setDistributionVisible(false);
          setDistributionValue({});
        }}
        onSubmit={() => {
          setDistributionVisible(false);
          setDistributionValue({});
        }}
        modalVisible={distributionVisible}
        record={distributionValue}
      />       */}
      <PermissionAssignment
        onCancel={() => {
          setDistributionVisible(false);
          setDistributionValue({});
        }}
        onFinish={() => {
          setDistributionVisible(false);
          setDistributionValue({});
        }}
        modalVisible={distributionVisible}
        record={distributionValue}
      />
    </>
  );
};

export default Versions;
