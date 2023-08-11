import { Drawer, Input, Space, Button, message } from "antd";
import {
    ProForm,
    ProFormText,
} from '@ant-design/pro-components';
import { createTemplateSetting, updateTemplateSetting } from '../service';
import { useRequestHandle } from '@/utils/utils';
import {  useRef, useState } from "react";
import { useUpdateEffect } from "@umijs/hooks";


export default (props) => {
    const { templateList, open, record, onSuccess, templateId, onCancel } = props;

    const formRef = useRef();
    const [templateSettingRule, setTemplateSettingRule] = useState([]);
    const [mainLocalPath, setMainLocalPath] = useState("");
    const createTemplateSettingRequest = useRequestHandle(createTemplateSetting, () => {
        message.success("保存成功");
        onSuccess();
    });

    const updateTemplateSettingRequest = useRequestHandle(updateTemplateSetting, () => {
        message.success("修改成功");
        onSuccess();
    });

    useUpdateEffect(() => {
        if (record.id) {
            formRef.current.setFieldsValue(record);
            setMainLocalPath(record.localPath);
            setTemplateSettingRule(record.settingRules ? JSON.parse(record.settingRules) : []);
        }
        else {
            formRef.current.setFieldsValue({ name: "", localPath: "" });
            setMainLocalPath("");
            setTemplateSettingRule([]);
        }
    }, [record]);
    return <Drawer
        title="配置设定"
        width={800}
        onClose={() => {
            onCancel();
        }}
        destroyOnClose
        extra={
            <Space>
                <Button
                    loading={createTemplateSettingRequest.loading || updateTemplateSettingRequest.loading}
                    onClick={() => {

                        formRef.current.submit();
                    }} type="primary">
                    保存
                </Button>
            </Space>
        }
        open={open}>
        <ProForm
            formRef={formRef}
            size="small"
            onFinish={async (values) => {
                console.log(values);
                if (record.id) {
                    await updateTemplateSettingRequest.run({ ...values, id: record.id, templateId: templateId, settingRules: JSON.stringify(templateSettingRule) });
                }
                else {
                    await createTemplateSettingRequest.run({ ...values, templateId: templateId, settingRules: JSON.stringify(templateSettingRule) });
                }

            }}
            submitter={false}
        >
            <ProForm.Group>
                <ProFormText
                    name="name"
                    label="配置名称"
                    tooltip="最长为 24 位"
                    placeholder="请输入名称"
                />
                <ProFormText
                    name={"localPath"}
                    label="主路径"
                    fieldProps={{
                        onChange: (e) => {
                            setMainLocalPath(e.target.value);
                        }

                    }}
                    tooltip="选择你需要保存的文件位置，仅本地启动时有效"
                    placeholder="请输入名称"
                />
            </ProForm.Group>

            {templateList && open ? templateList.map((item) => {
                return <div style={{ padding: "10px", border: "1px solid #f3f3f3", margin: "0 0 10px" }}
                    key={item.id}>模版名称：{item.name}
                    <span style={{ marginLeft: "20px" }}>文件名称： {item.prefixName}{item.suffixName}</span>
                    <Input
                        value={
                            templateSettingRule.find((rule) => rule.ruleKey === item.id)?.localPath}
                        onChange={(e) => {
                            console.log(e.target.value);
                            const newValue = { ruleKey: item.id, localPath: e.target.value };
                            const newTemplateSettingRule = [...templateSettingRule];
                            const index = newTemplateSettingRule.findIndex((item) => item.ruleKey === newValue.ruleKey);
                            if (index > -1) {
                                newTemplateSettingRule[index] = newValue;
                            }
                            else {
                                newTemplateSettingRule.push(newValue);
                            }
                            setTemplateSettingRule(newTemplateSettingRule);
                        }}
                        addonBefore={mainLocalPath} placeholder="子路径" />
                </div>
            }) : null}

        </ProForm>
    </Drawer >
}