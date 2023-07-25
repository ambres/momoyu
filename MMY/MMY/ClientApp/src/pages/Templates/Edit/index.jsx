import { EditOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { Col, Layout, Row, List, Button, Tag } from "antd"
import CodeEdit from '../components/CodeEdit';
import SaveForm from '../components/SaveForm';
import { get, createTemplateRule, updateTemplateRule } from '../service';
import { useParams } from "umi";

import { useEffect, useState } from "react";
import { useRequestHandle } from '@/utils/utils';

const { Sider } = Layout;

export default () => {

    const params = useParams();
    // const test = { key: "1", name: "测试模版", prefixName: "{{{C}}}AppService", suffixName: ".cs", code: "using Jupiter.AppService.Authorities.{{{C}}}s;\nusing Jupiter.AppService.Authorities.{{{C}}}s.Requests;\nusing Jupiter.AppService.Authorities.{{{C}}}s.Responses;\nusing Jupiter.AppService.Authorities.{{{C}}}s.ViewModels;\nusing Jupiter.Domain.Authorities.Model;\nusing Jupiter.Domain.Enums;\nusing Jupiter.Infrastructure.Attributes;\nusing Jupiter.Infrastructure.Cache.Interfaces;\nusing Jupiter.Infrastructure.Domain.SqlSugar;\nusing Jupiter.Infrastructure.Permission;\nusing Jupiter.Infrastructure.Permission.DataPermissions;\nusing Jupiter.Infrastructure.Responses;\nusing Microsoft.Extensions.Configuration;\n\nnamespace Jupiter.AppService.SqlSugar.Authorities.{{{C}}}s;\n\n/// <summary>\n/// {{{N}}}}服务接口实现类\n/// </summary>\n[ServiceComponent]\npublic class {{{C}}}Service : BaseQueryAppService<{{{C}}}>, I{{{C}}}Service\n{\n\n    /// <summary>\n    /// 读取{{{N}}}}分页列表\n    /// </summary>\n    /// <param name=\"request\"></param>\n    /// <returns></returns>\n    public async Task<PageResult<Get{{{C}}}PagesResponse>> GetPagesAsync(\n        GetRolePagesRequest request)\n    {\n        var result = await QueryNoTracking()\n            .HasWhere(request.Keyword, p => p.Name.Contains(request.Keyword!))\n            .Select(p => new GetRolePagesResponse\n            {\n               \n            })\n            .ToPageAsync(request);\n\n        return result;\n    }\n\n    /// <summary>\n    /// 读取{{{N}}}}信息\n    /// </summary>\n    /// <param name=\"id\"></param>\n    /// <returns></returns>\n    public async Task<{{{C}}}ViewModel> GetByIdAsync(string id)\n    {\n        var result = await QueryNoTracking()\n            .Where(p => p.Id == id)\n            .ToListAsync(p => new {{{C}}}ViewModel()\n            {\n              \n            });\n\n        return result.FirstOrDefault() ?? new {{{C}}}ViewModel();\n    }\n\n\n    /// <summary>\n    /// {{{N}}}}构造函数\n    /// </summary>\n    /// <param name=\"dbContext\"></param>\n    /// <param name=\"securityContextAccessor\"></param>\n    /// <param name=\"configuration\"></param>\n    /// <param name=\"cacheManager\"></param>\n    /// <param name=\"dataPermission\"></param>\n    public {{{C}}}Service(ISqlSugarClient dbContext, ISecurityContextAccessor securityContextAccessor,\n        IConfiguration? configuration, ICacheManager cacheManager,IDataPermission dataPermission) : base(dbContext,\n        securityContextAccessor, configuration, cacheManager,dataPermission)\n    {\n    }\n}" };
    const [templateList, setTemplateList] = useState();
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [detail, setDetail] = useState({});

    const [hoverItem, setHoverItem] = useState({});
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

            <Sider style={{ background: "#fff", borderRight: "solid #f3f3f3 1px", height: "calc(100vh - 140px)" }} width={350}>
                <List
                    size="small"
                    header={<div style={{ padding: "0 20px" }}><Button type="link"

                        onClick={() => {
                            setShowSaveForm(true);
                        }}
                        size="small" icon={<PlusOutlined />}>添加模版</Button></div>}
                    footer={<div />}
                    bordered={false}
                    dataSource={templateList}
                    renderItem={(item) => <List.Item
                        onClick={() => {
                            setHoverItem(item);
                        }}
                        style={hoverItem.id === item.id ? {
                            border: "dotted #00d911 1px",
                            cursor: "pointer"
                        } : {
                            cursor: "pointer"
                        }}
                        actions={[<a
                            onClick={() => {
                                setHoverItem(item);
                                setShowSaveForm(true);

                            }}
                            key="list-loadmore-edit"><EditOutlined /></a>]}>


                        {item.name}<Tag style={{ marginLeft: "20px" }} color="blue">{item.suffixName}</Tag>

                    </List.Item>}
                />
            </Sider>

            <CodeEdit record={hoverItem}

                onChange={(value) => {
                    const index = templateList.findIndex(i => i.key === hoverItem.key);
                    if (index > -1) {
                        templateList[index].code = value;

                        setTemplateList([...templateList]);
                    }
                    setHoverItem({ ...hoverItem, code: value });

                }}
            />
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


    </div>
}