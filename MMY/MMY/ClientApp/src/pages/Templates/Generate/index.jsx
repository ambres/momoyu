import { EditOutlined, ReadOutlined, SettingOutlined, SwapOutlined } from "@ant-design/icons";
import { Col, Layout, Row, Button, Tag, Divider, Select } from "antd"
import SaveForm from '../components/SaveForm';
import { get, createTemplateRule, updateTemplateRule, getSettingSelectView, getSettingById } from '../service';
import { useParams } from "umi";

import { useEffect, useState } from "react";
import { useRequestHandle } from '@/utils/utils';
import GenerateCode from '../components/GenerateCode';
import TemplateSetting from '../components/TemplateSetting';

const { Content } = Layout;

export default () => {

    const params = useParams();
    const [templateList, setTemplateList] = useState();
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [detail, setDetail] = useState({});
    const [hoverItem, setHoverItem] = useState({});
    const [settingOpen, setSettingOpen] = useState(false);
    const [hoverSetting, setHoverSetting] = useState({});
    const [editSetting, setEditSetting] = useState({});
    const [settingList, setSettingList] = useState([]);
    async function reloadTemplateList() {
        const result = await get({ ...params });
        setDetail(result.data);
        setTemplateList(result.data.rules);
        if (result.data.rules.length > 0) {
            if (hoverItem.id) {
                const a = result.data.rules.find(p => p.id === hoverItem.id);
                setHoverItem(a);
            }
            else {
                setHoverItem(result.data.rules[0]);
            }
        }
    }
    const createTemplateRuleRequest = useRequestHandle(createTemplateRule, () => {
        reloadTemplateList();
        setShowSaveForm(false);

    });
    const updateTemplateRuleRequest = useRequestHandle(updateTemplateRule, () => {
        reloadTemplateList();
        setShowSaveForm(false);
    });

    const getSettingByIdRequest = useRequestHandle(getSettingById, (data) => {
        setEditSetting(data);
        setSettingOpen(true);
    });

    useEffect(() => {
        async function getData() {
            const result = await get({ ...params });
            // setTemplateList(result);
            setDetail(result.data);
            setTemplateList(result.data.rules);
            if (result.data.rules.length > 0) {
                setHoverItem(result.data.rules[0]);
            }
        }
        getData();
    }, [params]);

    useEffect(() => {
        async function getData() {
            const result = await getSettingSelectView({ templateId: params.id });
            setSettingList(result.data);
        }
        getData();
    }, [params])
    return <div style={{ background: "#fff", border: "1px #f3f3f3 solid", height: "calc(100vh - 100px)" }}>
        <div style={{ background: "#fff", padding: "10px", borderBottom: "solid #f3f3f3 1px" }}>

            <Row justify={"space-around"}>
                <Col span={4}>模版-{detail.name}</Col>
                <Col span={20} style={{ textAlign: "right" }}>
                    <SettingOutlined />
                </Col>
            </Row>
        </div>
        <Layout >

            <Content>
                <div style={{ padding: "10px 10px 0" }}>
                    <Button type="primary" icon={<ReadOutlined />}>预览/生成</Button>
                </div>
                <Row>
                    <Col span={12} >
                        <div style={{ margin: "10px", padding: "10px", border: "1px solid #f3f3f3" }}>    当前配置：
                            <Select placeholder="请选择配置" size="small"
                                onChange={(_, item) => {
                                    setHoverSetting(item);
                                }}
                                style={{ width: "150px" }} options={settingList}></Select>
                            {hoverSetting.value ? <Button
                                style={{ marginLeft: "10px" }}
                                icon={<EditOutlined />}
                                loading={getSettingByIdRequest.loading}
                                onClick={() => {
                                    getSettingByIdRequest.run({ id: hoverSetting.value });
                                }}
                                type="link" size="small">编辑</Button> : null}
                            <Button style={{ marginLeft: "10px" }}
                                onClick={() => {
                                    setSettingOpen(true);
                                }}
                                icon={<SettingOutlined />} type="link" size="small">添加</Button>
                        </div>
                    </Col>

                    <Col span={12}>
                        <div style={{ margin: "10px", padding: "10px", border: "1px solid #f3f3f3" }}>  当前数据源：<Tag color="success">swagger</Tag>
                            <span style={{ margin: "10px" }}>/api/basic/get</span>
                            <Button icon={<SwapOutlined />} type="link" size="small">切换</Button>
                        </div>
                    </Col>
                </Row>
                <Divider orientation="left" style={{ margin: "0" }}>模版</Divider>
                <GenerateCode templateList={templateList} />
            </Content>

        </Layout>

        <SaveForm
            onSubmit={async (value) => {
                if (!value.id) {
                    createTemplateRuleRequest.run({ ...value, templateId: params.id })
                }
                else {
                    updateTemplateRuleRequest.run({ ...value, templateId: params.id })
                }
            }}
            onCancel={() => {
                setShowSaveForm(false);
            }}
            loading={false}
            modalVisible={showSaveForm}
            record={hoverItem}
        />
        <TemplateSetting
            templateId={params.id}
            record={editSetting}
            open={settingOpen}
            onCancel={() => {
                setSettingOpen(false);
                setEditSetting({});
            }}
            onSuccess={async () => {
                const result = await getSettingSelectView({ templateId: params.id });
                setSettingList(result.data);
                if (hoverSetting.value) {
                    const a = result.data.find(p => p.value === hoverSetting.value);
                    setHoverSetting(a);
                }
                setSettingOpen(false);
                setEditSetting({});
            }}
            templateList={templateList} />

    </div >
}