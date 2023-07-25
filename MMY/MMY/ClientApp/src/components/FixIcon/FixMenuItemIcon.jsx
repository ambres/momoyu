import React from 'react';
import FixIcon from './FixIcon';

// FIX从接口获取菜单时icon为string类型
const fixMenuItemIcon = (menus) => {
    menus.forEach((item) => {
        const { icon, children, routes } = item;

        if (icon && typeof icon === 'string') {
            item.icon = <FixIcon name={icon} />;
        }
        if (children && children.length > 0) {
            item.children = fixMenuItemIcon(children)
        }
        if (routes && routes.length > 0) {
            item.routes = fixMenuItemIcon(routes)
        }


    });
    return menus;
};

export default fixMenuItemIcon;