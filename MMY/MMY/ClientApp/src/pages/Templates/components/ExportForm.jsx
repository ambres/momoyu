import { ExportOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { Button } from 'antd';

const ExportForm = (props) => {
  const { loading, onSubmit } = props;

  return (
    <ModalForm
      title="导出Excel文件"
      width={450}
      trigger={
        <Button type="default" loading={loading}>
          <ExportOutlined /> 导出
        </Button>
      }
      onFinish={async (values) => {
        await onSubmit(values);
        return true;
      }}
      submitter={{
        searchConfig: {
          submitText: '导出',
        },
      }}
      modalProps={{
        maskClosable: false,
      }}
    >
      <ProFormText name="keyword" label="关键字" placeholder="请输入关键字" />
      <ProFormSelect
        name="status"
        label="状态"
        request={async () => [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ]}
        placeholder="默认导出所有状态"
      />
    </ModalForm>
  );
};
export default ExportForm;
