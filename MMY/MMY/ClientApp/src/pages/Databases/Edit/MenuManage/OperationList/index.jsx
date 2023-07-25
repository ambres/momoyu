import { getSorter, useRequestHandle } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProTable from '@ant-design/pro-table';
import { useUpdateEffect } from '@umijs/hooks';
import { Button, Drawer, Menu, message, Modal, Popconfirm, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Access, useAccess } from 'umi';
import SaveForm from './components/SaveForm';
import operation from './operation';
import { add, get, getMenuTreeData, query, remove, update, getHostApiAddress } from './service';

const OperationList = (props) => {
  const { modalVisible, onCancel, applicationId } = props;
  const [saveFormVisible, setSaveFormVisible] = useState(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const [key, setKey] = useState('');
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [menuTreeData, setMenuTreeData] = useState([]);
  const [isLoding, setIsLoading] = useState(false);
  const [hostApiAddress, setHostApiAddress] = useState("");
  const { canOperation, canShowOption } = useAccess();
  // 是否显示操作列
  const isShowOptionColumn = canShowOption([operation.update, operation.delete]);

  // 读取菜单树形数据列表
  // const getTreeRequest = useRequestHandle(getMenuTreeData, (data) => {
  //   setMenuTreeData(data);
  // });

  // 刷新
  const reload = () => {
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };
  const getHostApiAddressRequest = useRequestHandle(getHostApiAddress, (data) => {
    setHostApiAddress(data)
  });

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      const response = await getMenuTreeData({ applicationId });
      setIsLoading(false);
      if (response && response.success) {
        setMenuTreeData(response.data);
      }
      else {
        message.error("获取应用报错！");
      }

    }
    if (modalVisible) {
      init();
    }


  }, [applicationId, modalVisible]);
  useUpdateEffect(() => {
    if (modalVisible && applicationId) {
      getHostApiAddressRequest.run({ appId: applicationId });
    }
  }, [applicationId, modalVisible])
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
  // 删除
  const deleteRequest = useRequestHandle(remove, () => {
    message.success('删除成功.');
    reload();
  });

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      render: (dom, entity) => <a onClick={() => setRow(entity)}>{dom}</a>,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      width: 60,
    },
    {
      title: '更新时间',
      key: 'updated',
      dataIndex: 'updated',
      valueType: 'dateTime',
    },
    {
      title: '接口代码',
      key: 'code',
      dataIndex: 'code',
      hideInTable: true,
      valueType: 'code',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 130,
      hideInTable: !isShowOptionColumn,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Access accessible={canOperation(operation.update)}>
            <Button
              type="primary"
              size="small"
              onClick={async () => {
                const result = await get({ id: record.id });
                setSaveFormVisible(true);
                setUpdateFormValues({ ...result.data, opList: result.data.code.split(',') });
              }}
            >
              编辑
            </Button>
          </Access>

          <Access accessible={canOperation(operation.delete)}>
            <Popconfirm
              placement="topRight"
              title={'确定要这条数据删除吗？'}
              onConfirm={() => {
                deleteRequest.run({ id: record.id });
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button type="dashed" loading={false} danger size="small">
                删除
              </Button>
            </Popconfirm>
          </Access>
        </Space>
      ),
    },
  ];

  // 创建菜单
  const createMenu = (dataSource) => {
    // 创建菜单
    const menu = [];
    const create = (menuData, el) => {
      for (let i = 0; i < menuData.length; i += 1) {
        const item = menuData[i];
        if (item.children && item.children.length > 0) {
          // 如果有子级菜单
          const children = [];
          create(item.children, children);
          el.push(
            <Menu.SubMenu
              key={item.key}
              title={<span style={{ height: '100%', display: 'block' }}>{item.name}</span>}
            >
              {children}
            </Menu.SubMenu>,
          );
        } else {
          // 如果没有子级菜单
          el.push(
            <Menu.Item key={item.key} title={menuData[i].name}>
              {item.name}
            </Menu.Item>,
          );
        }
      }
    };

    create(dataSource, menu);
    return menu;
  };
  return (
    <Modal
      destroyOnClose
      title={'功能列表'}
      open={modalVisible}
      width={960}

      onCancel={() => onCancel()}
      footer={null}
    >

      <ProTable
        columns={columns}
        rowKey="id"
        actionRef={actionRef}
        // pagination={false}
        search={false}
        loading={isLoding}
        tableRender={(_, dom) => {
          return (
            <div
              style={{
                display: 'flex',
                width: '100%',
              }}
            >
              <Menu
                onSelect={(e) => {
                  setKey(e.key);
                }}
                style={{ width: 256 }}
                mode="inline"
              >
                {createMenu(menuTreeData)}
              </Menu>
              <div
                style={{
                  flex: 1,
                }}
              >
                {dom}
              </div>
            </div>
          );
        }}
        toolBarRender={() => [
          <Access key="create" accessible={canOperation(operation.create)}>
            <Button type="primary" onClick={() => setSaveFormVisible(true)}>
              <PlusOutlined /> 创建
            </Button>
          </Access>,
        ]}
        params={{
          menuId: key,
        }}
        request={async (params, sorter, filter) => {
          const data = params;
          data.pageIndex = params.current;
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
        dateFormatter="string"
        headerTitle="功能列表(点击左右菜单切换)"
      />

      <SaveForm
        onCancel={() => {
          setSaveFormVisible(false);
          setUpdateFormValues({});
        }}
        hostApiAddress={hostApiAddress}
        onSubmit={(value) => {
          const data = value;
          if (data.id) {
            updateRequest.run(data);
          } else {
            addRequest.run(data);
          }
        }}
        record={updateFormValues}
        loading={addRequest.loading || updateRequest.loading}
        modalVisible={saveFormVisible}
      />

      <Drawer
        width={680}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.id && (
          <ProDescriptions
            column={2}
            title={row?.accountName}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </Modal>
  );
};

export default OperationList;
