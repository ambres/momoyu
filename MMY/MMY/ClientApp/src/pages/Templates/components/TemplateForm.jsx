import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Modal, Spin } from 'antd';

const F = (props) => {
  const { modalVisible, onCancel, onSubmit, loading, record } = props;
  return (
    <Modal
      destroyOnClose
      title={record.id ? '修改' : '添加'}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      width={700}
    >
      <Spin tip="正在处理..." spinning={loading}>
        <ProForm
          onFinish={async (value) => {
            const params = value;
            await onSubmit(params);
          }}
          initialValues={{ ...record }}
        >
          <ProFormText
            name="name"
            label="模版名称"

            placeholder="请输入模版名称"
            rules={[{ required: true, message: '请输入模版名称！' }]}
          />


          <ProFormText
            name="desc"
            label="模版描述"

            placeholder="请输入模版描述"
            rules={[{ required: true, message: '请输入模版描述！' }]}
          />
          <ProFormText
            name="apiAddress"
            label="模型远程地址"

            placeholder="请输入模型远程地址"
            rules={[{ required: true, message: '请输入模型远程地址！' }]}
          />
        </ProForm>
      </Spin>
    </Modal>
  );
};

export default F;
