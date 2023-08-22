import { CopyOutlined, EyeOutlined } from "@ant-design/icons"
import { Col, Row, Button, Modal, Segmented, Empty, Select, Spin, message } from "antd"
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike'; // clike
import 'prismjs/components/prism-javascript'; // js
import 'prismjs/components/prism-csharp'; // c#
import 'prismjs/components/prism-java'; // java
import 'prismjs/themes/prism.css';
import { getEntitySumary, preview } from '../service';
import { useEffect, useState } from "react";
import { useUpdateEffect } from "@umijs/hooks";
import { useRequestHandle } from '@/utils/utils';
import { CopyToClipboard } from 'react-copy-to-clipboard';


export default (props) => {
    const { record, template } = props;
    const highlightMap = {
        ".cs": languages.csharp,
        ".java": languages.java,
        ".js": languages.js,
        ".jsx": languages.js,
        ".ts": languages.js
    }

    const [localEntity, setLocalEntity] = useState([]);// 本地实体
    const [selectModel, setSelectModel] = useState({});// 选择的模型
    const [previewModel, setPreviewModel] = useState({});// 预览的模型
    const [previewCode, setPreviewCode] = useState("");
    const [showSelectModel, setShowSelectModel] = useState(false);
    const previewRequest = useRequestHandle(preview, (data) => {
        setPreviewCode(data);
    })
    console.log(record, template)
    useEffect(() => {
        async function fetchData() {
            const res = await getEntitySumary(template.apiAddress);
            const response = await res.json();
            setLocalEntity(response.data);
            setPreviewModel(response.data[0]);
        }
        if (template.apiAddress) {
            fetchData();
        }

    }, [template]);
    useUpdateEffect(() => {
        setPreviewCode("");
        // console.log("previewModel", previewModel, record);
        if (previewModel.key) {
            previewRequest.run({
                code: record.code,
                transferCase: record.transferCase,
                entitySummary: previewModel
            })
        }

    }, [previewModel, record]);



    return <Spin spinning={previewRequest.loading}>
        <Row style={{ borderBottom: "1px solid #f3f3f3", padding: "10px" }}>
            <Col>

                <CopyToClipboard text={previewCode}
                    onCopy={() => { message.success("复制成功") }}>
                    <Button size='small' type='link'
                        icon={<CopyOutlined />}>复制代码</Button>
                </CopyToClipboard>
            </Col>
            <Col>
                <Button size='small'
                    onClick={() => {
                        setShowSelectModel(true);
                    }}
                    type='link' icon={<EyeOutlined />}>选择预览模型</Button>
            </Col>

            <Col style={{ lineHeight: "24px", marginLeft: "20px" }}>
                当前选中模型：{previewModel.name ? `[${previewModel.key}]${previewModel.name}` : "未选择模型"}
            </Col>

        </Row>
        {previewCode ? <pre style={{ fontSize: "12px" }} dangerouslySetInnerHTML={{
            __html: highlight(previewCode, highlightMap[record.suffixName])
        }} /> : <Empty description="请先选择模型" style={{ marginTop: "200px" }} />}


        <Modal open={showSelectModel} width={800}
            onOk={() => {
                setPreviewModel(selectModel);
                setShowSelectModel(false);
            }}
            onCancel={() => {
                setShowSelectModel(false);
            }}
        >
            <Segmented
                value={"1"}
                onChange={() => {
                    // setTabsValue(value);
                }}
                options={[{ label: "远程模型", value: "1" }]} />

            <div style={{ marginTop: "10px" }}>

                <Select
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(_, item) => {
                        setSelectModel(item);

                    }}
                    style={{ width: "100%" }}
                    showSearch
                    placeholder="选择模型"
                    options={
                        localEntity.map(item => {
                            return { ...item, label: `[${item.key}]${item.name}`, value: item.key }
                        }
                        )
                    } />
            </div>
            <Row style={{ marginTop: "2px" }}>

                <Col style={{ height: "500px", borderRight: "1px solid #f3f3f3", overflow: "auto" }} span={24}>
                    {selectModel.items ?
                        selectModel.items.map(item => {
                            return <div style={{ cursor: "pointer", padding: "10px 10px", border: "1px solid #f3f3f3" }} key={item.key}>[{item.key}]{item.name}</div>
                        }) : <Empty description={"请选择模型"} style={{ marginTop: "100px" }} />}
                </Col>
            </Row>



        </Modal>
    </Spin>
}