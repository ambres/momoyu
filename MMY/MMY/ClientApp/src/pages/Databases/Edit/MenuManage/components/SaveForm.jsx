import { useRequestHandle } from '@/utils/utils';
import ProForm, { ProFormDigit, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import { useUpdateEffect } from '@umijs/hooks';
import { Alert, Form, Modal, Popover, Spin, TreeSelect } from 'antd';
import { useRef, useState } from 'react';
import { getTreeSelectData } from '../service';
import FixIcon from '@/components/FixIcon/FixIcon';
import IconGroup from '@/components/FixIcon/IconGroup';


const SaveForm = (props) => {
  const { modalVisible, onCancel, onSubmit, loading, record, applicationId, isMenu, moduleId } = props;
  const [treeSelectData, setTreeSelectData] = useState([]);
  const getTreeSelectDataHandle = useRequestHandle(getTreeSelectData, (data) => {
    setTreeSelectData(data);
  });
  const formRef = useRef();
  const [iconKey, setIconKey] = useState("QuestionOutlined");
  useUpdateEffect(() => {
    if (isMenu && modalVisible) {
      getTreeSelectDataHandle.run({ applicationId });
    }

  }, [modalVisible]);
  useUpdateEffect(() => {
    if (record.id) {
      setIconKey(record.icon);
    }
  }, [record])

  const moduleChildren = treeSelectData.filter(c => c.id === moduleId);
  return (
    <Modal
      destroyOnClose
      title={record.id ? '编辑菜单' : '创建菜单'}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Spin tip="正在处理..." spinning={loading}>
      <Alert message="页面最终跳转地址规则:/[应用Code]/[模块路由]/*[菜单路由]"type="warning" />
        <ProForm
          onFinish={async (value) => {
            const params = value;
            if (record.id) {
              params.id = record.id;
            }
            await onSubmit(params);
          }}
          formRef={formRef}
          initialValues={{ status: true, sort: 0, ...record }}
        >
          {isMenu ? <Form.Item name="parentId" label="上级菜单/模块"
            rules={[{ required: true, message: '请选择上级菜单/模块' }]}
          >
            <TreeSelect
              allowClear={true}
              style={{ width: '100%' }}
              treeData={moduleChildren}
              placeholder="请选择上级菜单/模块"
              treeDefaultExpandAll
            />
          </Form.Item> : null}
          <ProFormText
            name="name"
            label={isMenu ? "菜单名称" : "模块名称"}
            fieldProps={{
              allowClear: true,
            }}
            placeholder={isMenu ? "请输入菜单名称" : "请输入模块名称"}
            rules={[{ required: true, message: isMenu ? "请输入菜单名称" : "请输入模块名称" }]}
          />
          {isMenu ? <ProFormText
            name="path"
            label="菜单路由"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入菜单路由"
            rules={[{ required: false, message: '请输入菜单路由！' }]}
          /> : <ProFormText
            name="path"
            label="模块路由"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入模块路由"
            rules={[{ required: false, message: '请输入模块路由！' }]}
          />}
          <ProFormText
            name="icon"
            label="图标"
            fieldProps={{
              allowClear: true,
              addonBefore: <FixIcon name={iconKey} />,
              addonAfter: <Popover content={
                <IconGroup onClick={(item) => {
                  setIconKey(item);
                  formRef.current.setFieldsValue({ icon: item });
                }} />
              } >快捷选择</Popover>,
              onChange: (e) => {
                setIconKey(e.target.value);
              }
            }}
            placeholder="请输入图标Code"
            rules={[{ required: true, message: '请输入图标Code！' }]}
          />

          <ProForm.Group>
            <ProFormDigit label="排序值" name="sort" min={0} fieldProps={{ precision: 0 }} />
            <ProFormSwitch
              name="isInside"
              label="是否显示"
              checkedChildren="显示"
              unCheckedChildren="隐藏"
            />
            {!record.id && (
              <ProFormSwitch
                name="status"
                label="状态"
                checkedChildren="启用"
                unCheckedChildren="禁用"
              />
            )}
          </ProForm.Group>
        </ProForm>
      </Spin>
    </Modal>
  );
};

export default SaveForm;
