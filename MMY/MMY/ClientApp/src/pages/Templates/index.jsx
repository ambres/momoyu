import { getSorter, useRequestHandle } from '@/utils/utils';
import { EditOutlined, PlusOutlined, ReadOutlined, SettingOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { Button, message, Space } from 'antd';
import { useRef, useState } from 'react';
import { Access, history, useAccess, useOutlet } from 'umi';
import SaveForm from './components/TemplateForm';
import operation from './operation';
import { add, get, query, update } from './service';

const TableList = () => {
  const [saveFormVisible, setSaveFormVisible] = useState(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef();
  const { canOperation, canShowOption } = useAccess();
  const [editLoading, setEditLoading] = useState(false);


  // 是否显示操作列
  const isShowOptionColumn = canShowOption([operation.update, operation.delete]);
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
  const columns = [

    {
      title: '模版名称',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '模版描述',
      dataIndex: 'desc',
      hideInSearch: true,
    },

    {
      title: '远程地址',
      dataIndex: 'apiAddress',
      hideInSearch: true,
    },

    {
      title: '创建时间',
      dataIndex: 'created',
      valueType: 'dateTime',
      width: 170,
      hideInSearch: true,
      sorter: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 160,
      fixed: 'right',
      hideInTable: !isShowOptionColumn,
      render: (_, record) => (
        <Space>
          <Access accessible={canOperation(operation.update)}>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              loading={editLoading}
              onClick={async () => {
                setEditLoading(true);
                const result = await get({ id: record.id });
                if (!result.success) {
                  setEditLoading(false);
                  message.error(result.message);
                  return;
                }
                setSaveFormVisible(true);
                setUpdateFormValues(result.data);
                setEditLoading(false);
              }}
            >
              编辑
            </Button>
          </Access>
          <Access accessible={canOperation(operation.update)}>
            <Button
              type="primary"
              size="small"
              icon={<SettingOutlined />}
              loading={false}
              onClick={async () => {
                history.push(`/templates/${record.id}`);
              }}
            >
              配置
            </Button>
          </Access>
          <Access accessible={canOperation(operation.update)&&false}>
            <Button
              type="primary"
              size="small"
              icon={<ReadOutlined />}
              loading={false}
              onClick={async () => {
                history.push(`/templates/generate/${record.id}`);
              }}
            >
              生成
            </Button>
          </Access>
        </Space>
      ),
    },
  ];
  const childrens = useOutlet();
  if (childrens) {
    return childrens;
  }
  return (
    <>
      <ProTable
        tableStyle={{}}
        headerTitle="代码模版列表"
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
        scroll={{
          x: 1200,
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
        columns={columns}
        rowSelection={false}
        expandable={{ defaultExpandAllRows: true }}
      />

      <SaveForm
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
        loading={updateRequest.loading || addRequest.loading}
        modalVisible={saveFormVisible}
        record={updateFormValues}
      />

    </>
  );
};

export default TableList;
