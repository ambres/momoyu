import ProForm, { ProFormText, ProFormRadio } from '@ant-design/pro-form';
import { Modal, Spin } from 'antd';

const SaveForm = (props) => {
    const { modalVisible, onCancel, onSubmit, loading, record } = props;
    return (
        <Modal
            destroyOnClose
            title={record.id ? '修改应用信息' : '添加应用'}
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
                    initialValues={{ ...record }}
                >
                    <ProFormText
                        name="applicationName"
                        label="应用名称"
                        disabled={record.corpFullName && record.isWorkWeChat}
                        placeholder="请输入应用名称"
                        rules={[{ required: true, message: '请输入应用名称！' }]}
                    />

                    <ProFormText
                        name="applicationCode"
                        label="应用Code"
                        disabled={record.corpFullName && record.isWorkWeChat}
                        placeholder="请输入应用Code"
                        rules={[{ required: true, message: '请输入应用Code！' }]}
                    />

                    <ProFormRadio.Group
                        label="应用类型"
                        name="applicationType"
                        initialValue={1}
                        options={[{ label: "业务应用", value: 1 }, { label: "公用应用", value: 2 }]}
                    />
                </ProForm>
            </Spin>
        </Modal>
    );
};

export default SaveForm;
