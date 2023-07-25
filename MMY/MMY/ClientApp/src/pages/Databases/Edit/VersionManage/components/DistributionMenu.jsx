import { useRequestHandle } from '@/utils/utils';
import { SaveOutlined } from '@ant-design/icons';
import { useUpdateEffect } from '@umijs/hooks';
import { Button, Col, Divider, Drawer, message, Row, Spin, Tag, Tree } from 'antd';
import { useState } from 'react';
import { getTreeSelectData, savePermission } from '../service';

const DistributionMenu = (props) => {
  const { modalVisible, onCancel, onSubmit, record } = props;
  const [menuTreeSelectData, setMenuTreeSelectData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectTreeNode, setSelectTreeNode] = useState([]);
  const getTreeRequest = useRequestHandle(getTreeSelectData, (data) => {
    setMenuTreeSelectData(data.allItems);
    setCheckedKeys(data.checkedKeys);
  });
  const savePermissionRequest = useRequestHandle(savePermission, () => {
    message.success('操作成功！');
    onSubmit();
  });
  const customerSubmit = () => {
    const postData = {
      roleId: '',
      menuIds: [],
      operationIds: [],
    };
    postData.roleId = record.id;
    const menuList = selectTreeNode.filter((item) => {
      return item.type === 1;
    });
    postData.menuIds = menuList.map((item) => {
      return item.id;
    });
    // 读取父级Ids
    const parentMenuIds = menuList.map((item) => {
      return item.parentId;
    });
    // 添加父级
    parentMenuIds.forEach((item) => {
      if (item && postData.menuIds.findIndex((p) => p === item) === -1) {
        postData.menuIds.push(item);
      }
    });
    const operationList = selectTreeNode.filter((item) => {
      return item.type === 2;
    });
    postData.operationIds = operationList.map((item) => {
      return item.id;
    });

    // 读取父级Ids
    const parentMenuIds1 = operationList.map((item) => {
      return item.parentId;
    });
    // 添加父级
    parentMenuIds1.forEach((item) => {
      if (item && postData.menuIds.findIndex((p) => p === item) === -1) {
        postData.menuIds.push(item);
      }
    });
    savePermissionRequest.run(postData);
  };
  useUpdateEffect(() => {
    if (modalVisible) {
      setMenuTreeSelectData([]);
      getTreeRequest.run({ versionId: record.id });
    }
  }, [modalVisible]);

  return (
    <Drawer
      placement={'right'}
      height={'100%'}
      width={'620px'}
      title={'权限分配'}
      open={modalVisible}
      onClose={() => onCancel()}
      footer={null}
    >
      <Spin tip="正在处理..." spinning={savePermissionRequest.loading || getTreeRequest.loading}>
        <Button
          type="primary"
          loading={savePermissionRequest.loading}
          onClick={() => {
            customerSubmit();
          }}
        >
          <SaveOutlined />
          <span>保存</span>
        </Button>
        <Divider />
        {menuTreeSelectData.length > 0 ? (
          <>
            <Tree
              checkable
              selectable={false}
              defaultExpandAll={true}
              onCheck={(checkedKeysValue, e) => {
                setSelectTreeNode(e.checkedNodes);
                setCheckedKeys(checkedKeysValue);
              }}
              showLine={{
                showLeafIcon: false,
              }}
              checkedKeys={checkedKeys}
              treeData={menuTreeSelectData}
              titleRender={(nodeData) => {
                return (
                  <>
                    <Row>
                      <Col flex="auto">
                        <span style={{ marginRight: '5px' }}>
                          <Tag color={nodeData.type === 1 ? 'blue' : 'green'}>
                            {nodeData.type === 1 ? '菜单' : '功能'}
                          </Tag>
                        </span>
                        {nodeData.title}
                      </Col>
                    </Row>
                  </>
                );
              }}
            />
          </>
        ) : null}
      </Spin>
    </Drawer>
  );
};

export default DistributionMenu;
