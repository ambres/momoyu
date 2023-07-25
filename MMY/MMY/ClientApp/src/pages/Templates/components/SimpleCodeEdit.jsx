
import { Modal, Spin, Row, Col, Tag } from 'antd';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike'; // clike
import 'prismjs/components/prism-javascript'; // js
import 'prismjs/components/prism-csharp'; // c#
import 'prismjs/components/prism-java'; // java

import 'prismjs/themes/prism.css';
import { useState } from 'react';
import { useUpdateEffect } from '@umijs/hooks';

const Edit = (props) => {
    const { modalVisible, onCancel, onSubmit, loading, record } = props;
    const highlightMap = {
        ".cs": languages.csharp,
        ".java": languages.java,
        ".js": languages.js,
        ".jsx": languages.js,
        ".ts": languages.js,

    }

    const [innerRecord, setInnerRecord] = useState(record);
    const [point, setPoint] = useState([0, 0]);

    useUpdateEffect(() => {
        if (modalVisible) {
            setInnerRecord(record);
        }
    }, [modalVisible])

    return (
        <Modal
            destroyOnClose
            title={'循环占位符'}
            open={modalVisible}
            onCancel={() => onCancel()}
            onOk={() => onSubmit(`{{{FOR:${innerRecord.code}:END}}}`)}
            width={700}
        >
            <Spin tip="正在处理..." spinning={loading}>
                <Row style={{ borderBottom: "1px solid #f3f3f3", padding: "5px 0", margin: "0 10px" }}>
                    <Col>
                        <Tag onClick={() => {
                            const v1 = innerRecord.code.substring(0, point[0]);
                            const v2 = innerRecord.code.substring(point[1], innerRecord.code.length);
                            const newCode = `${v1}{{{LN}}}${v2}`;
                            setInnerRecord({ ...innerRecord, code: newCode });
                            // onChange(newCode);
                        }}>命名占位符</Tag>
                    </Col>
                    <Col>
                        <Tag onClick={() => {
                            const v1 = innerRecord.code.substring(0, point[0]);
                            const v2 = innerRecord.code.substring(point[1], innerRecord.code.length);
                            const newCode = `${v1}{{{LR}}}${v2}`;
                            setInnerRecord({ ...innerRecord, code: newCode });
                        }}>注释占位符</Tag>
                    </Col>

                    <Col>
                        <Tag onClick={() => {
                            const v1 = innerRecord.code.substring(0, point[0]);
                            const v2 = innerRecord.code.substring(point[1], innerRecord.code.length);
                            const newCode = `${v1}{{{LT}}}${v2}`;
                            setInnerRecord({ ...innerRecord, code: newCode });
                            // todo
                        }}>类型占位符</Tag>
                    </Col>
                </Row>

                <div style={{ padding: "0 10px" }}>
                    <Editor

                        value={innerRecord.code}
                        onValueChange={code => {
                            setInnerRecord({ ...innerRecord, code });

                        }}
                        highlight={code => {
                            return highlight(code, highlightMap[innerRecord.suffixName]);
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
                            minHeight: "200px",
                            overflow: "auto",
                            border: "1px solid #f3f3f3",

                        }}
                    />
                </div>
            </Spin>
        </Modal>
    );
};

export default Edit;
