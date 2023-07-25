
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Modal, Spin } from 'antd';

const SaveForm = (props) => {
  const { modalVisible, onCancel, onSubmit, loading, record } = props;

  return (
    <Modal
      destroyOnClose
      title={record.id ? '修改版本信息' : '添加版本信息'}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Spin tip="正在处理..." spinning={loading}>
        <ProForm
          onFinish={async (value) => {
            const params = value;
            if (record.id) {
              params.id = record.id;
            }
            await onSubmit(params);
          }}
          initialValues={{ status: true, ...record }}
        >

          <ProFormText
            name="versionName"
            label="版本名称"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入版本名称"
            rules={[{ required: true, message: '请输入版本名称！' }]}
          />
          <ProFormText
            name="defaultRoute"
            label="默认跳转路由"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入默认跳转路由"
            rules={[{ required: true, message: '请输入默认跳转路由！' }]}
          />
        </ProForm>
      </Spin>
    </Modal>
  );
};

export default SaveForm;
