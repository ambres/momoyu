
import { Tag, Input, Row, Col, Empty, Button } from 'antd';
import { SwapOutlined, ReadOutlined, EyeOutlined } from "@ant-design/icons";

export default (props) => {
    const { templateList } = props;
    console.log(templateList);
    return <div >


        {templateList ? templateList.map((item) => {
            return <div style={{ margin: "10px", border: "1px solid #f3f3f3" }} key={item.id}>
                <Row style={{ borderBottom: "1px solid #f3f3f3", padding: "10px" }}>
                    <Col span={24}> 模版名称：{item.name}
                        <span style={{ marginLeft: "20px" }}>文件名称： {item.prefixName}{item.suffixName}</span>
                        <Button
                            style={{ margin: "0 10px" }}
                            type="primary"
                            size="small"
                            icon={<EyeOutlined />}
                            loading={false}
                            onClick={async () => {
                                // history.push(`/templates/generate/${record.id}`);
                            }}
                        >
                            预览
                        </Button>
                        <Button
                            type="primary"
                            size="small"
                            icon={<ReadOutlined />}
                            loading={false}
                            onClick={async () => {
                                // history.push(`/templates/generate/${record.id}`);
                            }}
                        >
                            独立生成
                        </Button>
                    </Col>

                </Row>
                <Row style={{ padding: "10px" }} gutter={[10]}>
                    <Col span={12}> <div style={{ marginBottom: "10px" }}>发布路径:</div> <Input size='small' value={"E://a/b/c/d/template"}></Input></Col>

                    <Col span={12}> <div style={{ marginBottom: "10px" }}>数据源:</div>
                        <div><Tag color="success">swagger</Tag>这是一个数据源占位

                            <Button size='small' type='link' icon={<SwapOutlined />}>切换</Button>
                        </div>
                    </Col>
                </Row></div>
        }) : <Empty description={"未配置模版规则"} />}


        {/* 
                <Descriptions title={false} size={"small"} >
                    <Descriptions.Item label="全路径">
                        <Input size='small' value={"E://a/b/c/d/template"}></Input>
                    </Descriptions.Item>
                    <Descriptions.Item label="模版名称">{item.name}</Descriptions.Item>
                    <Descriptions.Item label="文件全称">    {item.prefixName}{item.suffixName}
                    </Descriptions.Item>
                    <Descriptions.Item label="配置路径">E://a/b/c/d</Descriptions.Item>
                    <Descriptions.Item label="子路径">/template</Descriptions.Item>

                    <Descriptions.Item label="数据源类型">swagger</Descriptions.Item>
                    <Descriptions.Item label="数据源名称">/api/basic/getconfig</Descriptions.Item>
                </Descriptions> */}



    </div>
}