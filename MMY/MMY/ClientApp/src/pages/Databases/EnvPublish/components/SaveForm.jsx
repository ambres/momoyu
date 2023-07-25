
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Modal, Spin } from 'antd';

const SaveForm = (props) => {
  const { modalVisible, onCancel, onSubmit, loading, record } = props;

  return (
    <Modal
      destroyOnClose
      title={record.id ? '修改环境信息' : '添加环境信息'}
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
            name="environmentName"
            label="环境名称"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入环境名称"
            rules={[{ required: true, message: '请输入环境名称！' }]}
          />
          <ProFormText
            name="environment"
            label="环境CODE"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入环境CODE"
            rules={[{ required: true, message: '请输入环境CODE！' }]}
          />
          <ProFormText
            name="hostApiAddress"
            label="后端服务接口"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入后端服务接口"
            rules={[{ required: true, message: '请输入后端服务接口！' }]}
          />
          <ProFormText
            name="entry"
            label="前端入口"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入前端入口"
            rules={[{ required: true, message: '请输入前端入口！' }]}
          />
          <ProFormText
            name="uploadAddress"
            label="上传服务接口"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入上传服务接口"
            rules={[{ required: true, message: '请输入上传服务接口！' }]}
          />
          <ProFormText
            name="cdnAddress"
            label="静态文件地址"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入静态文件地址"
            rules={[{ required: true, message: '请输入静态文件地址！' }]}
          />
          <ProFormText
            name="rtcAddress"
            label="RTC请求地址"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入RTC请求地址"
            rules={[{ required: true, message: '请输入RTC请求地址！' }]}
          />

          <ProFormTextArea
            name="extendConfigJson"
            label="额外扩展JSON"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入额外扩展JSON"
            rules={[{ required: true, message: '请输入额外扩展JSON！' }]} />
        </ProForm>
      </Spin>
    </Modal>
  );
};

export default SaveForm;
