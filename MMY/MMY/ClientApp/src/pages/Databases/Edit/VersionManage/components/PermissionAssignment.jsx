import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Checkbox, Drawer, Spin, message } from 'antd';
import { convertCascader, useRequestHandle } from '@/utils/utils';
import { SaveOutlined } from '@ant-design/icons';
import { getTreeSelectData, savePermission } from '../service';

const getMenuChildrenKeys = (items) => {
  if (!items) {
    return [];
  }
  const keys = [];
  items.forEach((p) => {
    keys.push(p.value);
    if (p.children) {
      keys.push(...getMenuChildrenKeys(p.children));
    }
  });
  return keys;
};
const getOperationChildrenKeys = (items) => {
  if (!items) {
    return [];
  }
  const keys = [];
  items.forEach((p) => {
    if (p.operations?.length > 0) {
      keys.push(...p.operations.map((p) => p.value));
    }
    if (p.children) {
      keys.push(...getOperationChildrenKeys(p.children));
    }
  });
  return keys;
};
const allChecked = (record, keys) => {
  if (!keys.includes(record.value)) {
    return false;
  }
  let operationCount = 0;
  for (let i = 0; i < record.operations.length; i += 1) {
    const item = record.operations[i];
    if (keys.includes(item.value)) {
      operationCount += 1;
    }
  }
  return operationCount === record.operations?.length;
};
const getAllCheckedChildrenKeys = (items, keys) => {
  if (!items) {
    return [];
  }
  const rowKeys = [];
  items.forEach((p) => {
    if (allChecked(p, keys)) {
      rowKeys.push(p.value);
    }
    if (p.children) {
      rowKeys.push(...getAllCheckedChildrenKeys(p.children, keys));
    }
  });
  return rowKeys;
};

const TreeData = (props) => {
  const { modalVisible, onCancel, onFinish, record = {} } = props;

  const [dataSource, setDataSource] = React.useState([]);
  const [menuCheckedKeys, setMenuCheckedKeys] = React.useState([]);
  const [operationCheckedKeys, setOperationCheckedKeys] = React.useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const result = await getTreeSelectData({ versionId: record.id });
      setLoading(false);
      if (result.success) {
        setDataSource(convertCascader(result.data.items));
        setMenuCheckedKeys(result.data.menuCheckedKeys);
        setOperationCheckedKeys(result.data.operationCheckedKeys);
        setSelectedRowKeys(
          getAllCheckedChildrenKeys(result.data.items, [
            ...result.data.menuCheckedKeys,
            ...result.data.operationCheckedKeys,
          ]),
        );
      }
    };
    if (modalVisible && record?.id) {
      setLoading(true);
      fetch();
    }
  }, [record?.id, modalVisible]);

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'label',
      key: 'label',
      width: 220,
    },
    {
      title: '菜单',
      dataIndex: 'menu',
      key: 'menu',
      width: 65,
      align: 'center',
      render: (_, record) => {
        return (
          <Checkbox
            value={record.value}
            checked={menuCheckedKeys.includes(record.value)}
            onChange={(e) => {
              const { checked, value } = e.target;
              const rowKeys = checked
                ? [...menuCheckedKeys, value]
                : menuCheckedKeys.filter((p) => p !== value);
              setMenuCheckedKeys(rowKeys);
              const flag = allChecked(record, [...rowKeys, ...operationCheckedKeys]);
              const selectedKeys = flag
                ? [...selectedRowKeys, record.value]
                : selectedRowKeys.filter((p) => p !== record.value);
              setSelectedRowKeys(selectedKeys);
            }}
          />
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operations',
      render: (_, record) => {
        if (record.operations?.length === 0) {
          return '';
        }
        return record.operations.map((p) => (
          <Checkbox
            value={p.value}
            key={p.value}
            checked={operationCheckedKeys.includes(p.value)}
            onChange={(e) => {
              const { checked, value } = e.target;
              const rowKeys = checked
                ? [...operationCheckedKeys, value]
                : operationCheckedKeys.filter((p) => p !== value);
              setOperationCheckedKeys(rowKeys);
              const flag = allChecked(record, [...menuCheckedKeys, ...rowKeys]);
              const selectedKeys = flag
                ? [...selectedRowKeys, record.value]
                : selectedRowKeys.filter((p) => p !== record.value);
              setSelectedRowKeys(selectedKeys);
            }}
          >
            {p.label}
          </Checkbox>
        ));
      },
    },
  ];

  const savePermissionRequest = useRequestHandle(savePermission, () => {
    message.success('保存成功');
    if (typeof onFinish === 'function') {
      onFinish();
    }
  });

  return (
    <Drawer
      placement={'right'}
      height={'100%'}
      width={1024}
      title={'权限分配'}
      open={modalVisible}
      onClose={() => onCancel()}
      footer={null}
    >
      <Spin tip="正在处理..." spinning={savePermissionRequest.loading || loading}>
        <Space>
          <Button
            type={'primary'}
            icon={<SaveOutlined />}
            loading={savePermissionRequest.loading}
            onClick={() => {
              savePermissionRequest.run({
                versionId: record.id,
                menuIds: menuCheckedKeys,
                operationIds: operationCheckedKeys,
              });
            }}
          >
            <span>保存</span>
          </Button>
        </Space>
        <div style={{ height: 20 }} />
        {dataSource.length > 0 ? (
          <Table
            rowKey={'value'}
            columns={columns}
            rowSelection={{
              selectedRowKeys,
              onSelect: (record, selected) => {
                // 菜单
                const menuKeys = [record.value];
                const menuRowKeys = selected
                  ? [...menuCheckedKeys, ...menuKeys]
                  : menuCheckedKeys.filter((p) => !menuKeys.includes(p));
                setMenuCheckedKeys(menuRowKeys);
                // 操作
                const operationKeys = [];
                if (record.operations?.length > 0) {
                  operationKeys.push(...record.operations.map((p) => p.value));
                }
                const operationRowKeys = selected
                  ? [...operationCheckedKeys, ...operationKeys]
                  : operationCheckedKeys.filter((p) => !operationKeys.includes(p));
                setOperationCheckedKeys(operationRowKeys);
                setSelectedRowKeys(
                  getAllCheckedChildrenKeys(dataSource, [...menuRowKeys, ...operationRowKeys]),
                );
              },
              onSelectAll: (_, selectedRows) => {
                const menuKeys = getMenuChildrenKeys(selectedRows);
                setMenuCheckedKeys(menuKeys);
                const operationKeys = getOperationChildrenKeys(selectedRows);
                setOperationCheckedKeys(operationKeys);
                setSelectedRowKeys(
                  getAllCheckedChildrenKeys(dataSource, [...menuKeys, ...operationKeys]),
                );
              },
            }}
            bordered
            expandable={{
              // expandRowByClick: true,
              defaultExpandAllRows: true,
            }}
            pagination={false}
            dataSource={dataSource}
          />
        ) : null}
      </Spin>
    </Drawer>
  );
};

export default TreeData;
