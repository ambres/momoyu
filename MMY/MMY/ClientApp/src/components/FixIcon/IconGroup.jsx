import { Row, Col } from "antd";
import FixIcon from "./FixIcon";

const IconGroup = {
    DateBaseIcon: ["AreaChartOutlined", "PieChartOutlined", "BarChartOutlined", "DotChartOutlined", "LineChartOutlined", "RadarChartOutlined"
        , "HeatMapOutlined", "FallOutlined", "RiseOutlined", "StockOutlined", "BoxPlotOutlined", "FundOutlined", "SlidersOutlined"],
    OtherIcon: ["AccountBookOutlined", "AimOutlined", "AlertOutlined", "ApartmentOutlined", "ApiOutlined", "AppstoreAddOutlined", "AppstoreOutlined"
        , "AudioOutlined", "AuditOutlined", "BankOutlined", "BarcodeOutlined", "BarsOutlined", "BlockOutlined", "BellOutlined", "CalendarOutlined",
        "CarOutlined", "ClearOutlined", "CloudServerOutlined", "ClusterOutlined", "CodeOutlined", "CoffeeOutlined", "CommentOutlined", "ConsoleSqlOutlined", "ContactsOutlined"
        , "ControlOutlined", "CreditCardOutlined", "CrownOutlined", "DashboardOutlined", "DeploymentUnitOutlined", "DollarOutlined", "EnvironmentOutlined", "ExperimentOutlined"
        , "EyeInvisibleOutlined", "FileDoneOutlined", "FireOutlined", "FlagOutlined", "FolderOutlined", "HomeOutlined", "InsuranceOutlined", "MailOutlined", "ReadOutlined",
        "ReconciliationOutlined", "SettingOutlined", "TagsOutlined", "VerifiedOutlined", "WalletOutlined"
    ]
};


export default (props) => {
    const { onClick, selectKey } = props;
    const styles = { padding: "8px", fontSize: "20px", cursor: "pointer" }
    return <Row style={{ width: "300px" }}>
        <Col span={24} style={{ fontWeight: "bold" }}>数据类ICON</Col>
        {IconGroup.DateBaseIcon.map(item => {
            return <Col onClick={() => {
                if (onClick) {
                    onClick(item)
                }
            }} style={selectKey === item ? { ...styles, color: "blue" } : { ...styles }} key={item}>
                <FixIcon name={item} />
            </Col>
        })}

        <Col span={24} style={{ fontWeight: "bold" }}>公用类ICON</Col>
        {IconGroup.OtherIcon.map(item => {
            return <Col onClick={() => {
                if (onClick) {
                    onClick(item)
                }
            }} style={selectKey === item ? { ...styles, color: "blue" } : { ...styles }} key={item}>
                <FixIcon name={item} />
            </Col>
        })}
    </Row>
}