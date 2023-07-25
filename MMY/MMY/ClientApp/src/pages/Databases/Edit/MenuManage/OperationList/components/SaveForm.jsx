import { useRequestHandle } from '@/utils/utils';
import ProForm, { ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { useUpdateEffect } from '@umijs/hooks';
import { Form, Modal, Spin, TreeSelect } from 'antd';
import { useState } from 'react';
import { getCodes } from '../service';

const AddAction = (props) => {
  const { modalVisible, onCancel, onSubmit, loading, record, hostApiAddress } = props;
  const [treeSelectData, setTreeSelectData] = useState([]);
  const getCodesRequest = useRequestHandle(getCodes, (data) => {
    setTreeSelectData(data);
  });
  useUpdateEffect(() => {
    if (modalVisible && hostApiAddress) {
      getCodesRequest.run({ hostApiAddress });
    }
  }, [modalVisible, hostApiAddress]);
  return (
    <Modal
      destroyOnClose
      title={record.id ? '编辑操作' : '新增操作'}
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
            params.menuId = record.menuId;
            params.code = params.opList.join(',');
            await onSubmit(params);
          }}
          initialValues={record}
        >
          <ProFormText
            name="name"
            label="名称"
            fieldProps={{
              allowClear: true,
            }}
            placeholder="请输入操作名称"
            rules={[{ required: true, message: '请输入操作名称！' }]}
          />

          <ProFormDigit label="排序值" name="sort" min={0} fieldProps={{ precision: 0 }} />

          <Form.Item name="opList" label="接口授权">
            <TreeSelect
              multiple={true}
              style={{ width: '100%' }}
              treeData={treeSelectData}
              placeholder="请选择操作需要的接口"
              treeDefaultExpandAll
            />
          </Form.Item>
        </ProForm>
      </Spin>
    </Modal>
  );
};

export default AddAction;
