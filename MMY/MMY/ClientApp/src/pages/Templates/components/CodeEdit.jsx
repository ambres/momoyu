import React, { useState } from 'react';
import { Badge, Empty, message } from 'antd';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike'; // clike
import 'prismjs/components/prism-javascript'; // js
import 'prismjs/components/prism-csharp'; // c#
import 'prismjs/components/prism-java'; // java

import 'prismjs/themes/prism.css';
import { Button, Col, Layout, Row, Segmented, Tag } from "antd"
import { useUpdateEffect } from '@umijs/hooks';
import SimpleCodeEdit from './SimpleCodeEdit';
import { useRequestHandle } from '@/utils/utils';
import { updateTemplateRuleCode } from '../service';
import PreviewCode from './PreviewCode';

const { Content } = Layout;

export default (props) => {

    const { record, onChange,template } = props;

    // const regex = /\{\{\{.*?\}\}\}/s;
    const highlightMap = {
        ".cs": languages.csharp,
        ".java": languages.java,
        ".js": languages.js,
        ".jsx": languages.js,
        ".ts": languages.js,

    }

    const [innerRecord, setInnerRecord] = useState(record);
    const [point, setPoint] = useState([0, 0]);
    const [tabsValue, setTabsValue] = useState("1");
    const [showSimpleEdit, setShowSimpleEdit] = useState(false);
    const updateTemplateRuleCodeRequest = useRequestHandle(updateTemplateRuleCode, () => {
        message.success("保存成功");
    });
    useUpdateEffect(() => {
        if (record.id !== innerRecord.id) {
            setInnerRecord({ ...record, code: record.code ? record.code : "" });
        }
    }, [record]);
    return <>
        <Content style={{ height: "calc(100vh - 140px)", overflow: "auto" }}>

            {innerRecord.suffixName ? <> <Row style={{ borderBottom: "1px solid #f3f3f3", padding: "10px" }}>
                <Col span={20}>
                    <Segmented
                        value={tabsValue}
                        onChange={(value) => {
                            setTabsValue(value);
                        }}
                        options={[{ label: "模版", value: "1" }, { label: "预览", value: "2" }]} />
                    <Button style={{ marginLeft: "10px" }}
                        onClick={() => {
                            updateTemplateRuleCodeRequest.run({ id: record.id, code: innerRecord.code });
                        }}
                        type='primary' size='small'>保存</Button>
                </Col>
            </Row>
                {tabsValue === "1" ? <>
                    <Row style={{ borderBottom: "1px solid #f3f3f3", padding: "10px" }}>
                        <Col>
                            <Tag onClick={() => {
                                const v1 = innerRecord.code.substring(0, point[0]);
                                const v2 = innerRecord.code.substring(point[1], innerRecord.code.length);
                                const newCode = `${v1}{{{C}}}${v2}`;
                                setInnerRecord({ ...innerRecord, code: newCode });
                                onChange(newCode);
                            }}>类名占位符</Tag>
                        </Col>
                        <Col>
                            <Tag onClick={() => {
                                const v1 = innerRecord.code.substring(0, point[0]);
                                const v2 = innerRecord.code.substring(point[1], innerRecord.code.length);
                                const newCode = `${v1}{{{N}}}${v2}`;
                                setInnerRecord({ ...innerRecord, code: newCode });
                                onChange(newCode);
                            }}>类名注释占位符</Tag>
                        </Col>
                        <Col>
                            <Tag onClick={() => {
                                // todo
                                setShowSimpleEdit(true);
                            }}>字段循环占位符</Tag>
                        </Col>
                    </Row>
                    <Badge.Ribbon
                        style={{ insetInlineEnd: "-4px", marginTop: "-8px" }}
                        text={innerRecord.prefixName + innerRecord.suffixName}>
                        <Editor

                            value={innerRecord.code}
                            onValueChange={code => {
                                setInnerRecord({ ...innerRecord, code });
                                onChange(code);
                            }}
                            highlight={code => {
                                if (code) {
                                    let lg = languages.js;
                                    if (innerRecord.suffixName) {
                                        lg = highlightMap[innerRecord.suffixName];
                                    }
                                    return highlight(code, lg);
                                }
                                return "";

                            }}
                            padding={10}
                            onClick={(e) => {
                                setPoint([e.target.selectionStart, e.target.selectionEnd])
                            }}
                            onKeyDown={(e => {
                                setPoint([e.target.selectionStart, e.target.selectionEnd])
                            })}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 12,
                                minHeight: "calc(100vh - 236px)",
                                overflow: "auto",
                                border: "0"
                            }}
                        />
                    </Badge.Ribbon></>

                    :
                    <PreviewCode template={template} record={innerRecord} />

                }    </>
                : <Empty style={{ marginTop: "200px" }} description={"请先添加模版"} />}
        </Content>
        <SimpleCodeEdit
            onSubmit={async (value) => {
                // 先判断value.key是否在templateList中存在，存在则是修改，否则是新增
                const v1 = innerRecord.code.substring(0, point[0]);
                const v2 = innerRecord.code.substring(point[1], innerRecord.code.length);
                const newCode = `${v1}${value}${v2}`;
                setInnerRecord({ ...innerRecord, code: newCode });
                onChange(newCode);

            }}
            onCancel={() => {
                setShowSimpleEdit(false);
                // setHoverItem({});
            }}
            loading={false}
            modalVisible={showSimpleEdit}
            record={{ ...innerRecord, code: "" }}
        />
    </>
}