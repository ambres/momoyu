import { getSorter, useRequestHandle } from '@/utils/utils';
import {
  PlusOutlined,
} from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProTable from '@ant-design/pro-table';
import {
  Button,
  Drawer,
  message,
  Popover,
  Space,
} from 'antd';
import { useRef, useState } from 'react';
import { Access, useAccess } from 'umi';
import SaveForm from './components/SaveForm';
import operation from './operation';
import { add, query, update, get } from './service';
import ReactJson from 'react-json-view'

const Env = (props) => {
  const { applicationId } = props;
  const [saveFormVisible, setSaveFormVisible] = useState(false);
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const { canOperation, canShowOption } = useAccess();
  // 是否显示操作列
  const isShowOptionColumn = canShowOption([
    operation.update,
    operation.delete,
    operation.assignPermissions,
  ]);

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
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      fixed: 'left',
      width: 75,
    },
    {
      title: '环境名称',
      dataIndex: 'environmentName',
      ellipsis: true,
      render: (dom, entity) => <a onClick={() => setRow(entity)}>{dom}</a>,
      fixed: 'left',
      width: 170,
    },
    {
      title: '环境Code',
      dataIndex: 'environment',
      ellipsis: true,
    },
    {
      title: '链接配置',
      dataIndex: 'entry',
      ellipsis: true,
      render: (_, entity) => {
        return <Popover content={<div>
          <h5 span="24">应用接口地址：{entity.hostApiAddress}</h5>
          <h5 span="24">文件上传地址：{entity.uploadAddress}</h5>
          <h5 span="24">静态文件地址：{entity.cdnAddress}</h5>
          <h5 span="24">RTC地址：{entity.rtcAddress}</h5>
          <h5 span="24">前端入口地址：{entity.entry}</h5>
        </div>}>点击查看</Popover>


      }
    },
    {
      title: '扩展JSON',
      dataIndex: 'extendConfigJson',
      ellipsis: true,
      render: (_, entity) => {
        return <Popover content={<ReactJson src={JSON.parse(entity.extendConfigJson)} />}>点击查看</Popover>
      }
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

        </Space>
      ),
    },
  ];
  return (
    <>
      <ProTable
        headerTitle="环境配置"
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

    </>
  );
};

export default Env;
