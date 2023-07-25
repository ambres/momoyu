import React from 'react';
import * as AllIcons from '@ant-design/icons';


const FixIcon = (props) => {
    const { name } = props;
    if (Object.keys(AllIcons).indexOf(name) > -1) {
        return React.createElement(AllIcons[name]);
    }
    return React.createElement(AllIcons.QuestionOutlined)
};

export default FixIcon;