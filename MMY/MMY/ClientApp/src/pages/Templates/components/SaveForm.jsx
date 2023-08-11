import ProForm, { ProFormText, ProFormRadio } from '@ant-design/pro-form';
import { Modal, Spin } from 'antd';
const SaveForm = (props) => {
  const { modalVisible, onCancel, onSubmit, loading, record } = props;
  return (
    <Modal
      destroyOnClose
      title={record && record.id ? '修改' : '添加'}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      width={700}
    >
      <Spin tip="正在处理..." spinning={loading}>
        <ProForm
          onFinish={async (value) => {
            const params = value;
            await onSubmit({ ...params, id: record.id });
          }}
          initialValues={{ ...record }}
        >
          <ProFormText
            name="name"
            label="模版名称"

            placeholder="请输入模版名称"
            rules={[{ required: true, message: '请输入模版名称！' }]}
          />


          <ProForm.Group>
            <ProFormText
              name="prefixName"
              label="前缀"
              width={"320px"}
              placeholder="请输入前缀"
              extra="特殊前缀{{{C}}},自动填充类名"
            // rules={[{ required: true, message: '请输入联系人！' }]}
            />
            <ProFormText
              name="suffixName"
              label="后缀"
              placeholder="请输入后缀 eg: .jsx"

            />

          </ProForm.Group>
          <ProForm.Group>
            <ProFormRadio.Group
              label="英文转换方式"
              name="transferCase"
              initialValue={0}
              options={[{ value: 0, label: "首字母大写" }, { value: 1, label: "驼峰" }]}
            />
            <ProFormRadio.Group
              label="数据来源"
              name="sourceType"
              initialValue={0}
              options={[
                { value: 0, label: "模型" }
                , { value: 1, label: "Swagger" }
                , { value: 2, label: "YApi" }]}
            />
          </ProForm.Group>
          {/* <ProFormText
            name="localPublishPath"
            label="本地发布路径"
            placeholder="请输入本地发布路径"
            extra={"请注意window和mac环境路径命名方式不同"}
          /> */}
        </ProForm>
      </Spin>
    </Modal>
  );
};

export default SaveForm;
