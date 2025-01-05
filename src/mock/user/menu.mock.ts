import type { MenuList } from '@/interface/layout/menu.interface';

import { intercepter, mock } from '../config';

const mockMenuList: MenuList = [
  {
    code: 'dashboard',
    label: {
      zh_CN: '首页',
      en_US: 'Thống Kê',
    },
    icon: 'dashboard',
    path: '/dashboard',
  },
  {
    code: 'employee',
    label: {
      zh_CN: '员工管理',
      en_US: 'Quản lý nhân sự',
    },
    icon: 'employee',
    path: '/employee-management',
    children: [
      {
        code: 'doctor',
        label: {
          zh_CN: '医生',
          en_US: 'Quản lý bác sĩ',
        },
        path: '/employee-management/doctor',
      },
      {
        code: 'nurse',
        label: {
          zh_CN: '护士',
          en_US: 'Quản lý điều dưỡng',
        },
        path: '/employee-management/nurse',
      },
    ],
  },
  {
    code: 'oldPeople',
    label: {
      zh_CN: '老人管理',
      en_US: 'Quản lý người già',
    },
    icon: 'oldPeople',
    path: '/old-people',
  },
  {
    code: 'facility',
    label: {
      zh_CN: '老人管理',
      en_US: 'Quản lý cơ sở',
    },
    icon: 'facility',
    path: '/facility',
    children: [
      {
        code: 'storage',
        label: {
          zh_CN: '医生',
          en_US: 'Quản lý Kho',
        },
        path: '/facility/storage',
      },
      {
        code: 'food',
        label: {
          zh_CN: '护士',
          en_US: 'Quản lý Thực phẩm',
        },
        path: '/facility/food',
      },
    ],
  },
  // {
  //   code: 'component',
  //   label: {
  //     zh_CN: '组件',
  //     en_US: 'Component',
  //   },
  //   icon: 'permission',
  //   path: '/component',
  //   children: [
  //     {
  //       code: 'componentForm',
  //       label: {
  //         zh_CN: '表单',
  //         en_US: 'Form',
  //       },
  //       path: '/component/form',
  //     },
  //     {
  //       code: 'componentTable',
  //       label: {
  //         zh_CN: '表格',
  //         en_US: 'Table',
  //       },
  //       path: '/component/table',
  //     },
  //     {
  //       code: 'componentSearch',
  //       label: {
  //         zh_CN: '查询',
  //         en_US: 'Search',
  //       },
  //       path: '/component/search',
  //     },
  //     {
  //       code: 'componentAside',
  //       label: {
  //         zh_CN: '侧边栏',
  //         en_US: 'Aside',
  //       },
  //       path: '/component/aside',
  //     },
  //     {
  //       code: 'componentTabs',
  //       label: {
  //         zh_CN: '选项卡',
  //         en_US: 'Tabs',
  //       },
  //       path: '/component/tabs',
  //     },
  //     {
  //       code: 'componentRadioCards',
  //       label: {
  //         zh_CN: '单选卡片',
  //         en_US: 'Radio Cards',
  //       },
  //       path: '/component/radio-cards',
  //     },
  //   ],
  // },

  // {
  //   code: 'business',
  //   label: {
  //     zh_CN: '业务',
  //     en_US: 'Business',
  //   },
  //   icon: 'permission',
  //   path: '/business',
  //   children: [
  //     {
  //       code: 'basic',
  //       label: {
  //         zh_CN: '基本',
  //         en_US: 'Basic',
  //       },
  //       path: '/business/basic',
  //     },
  //     {
  //       code: 'withSearch',
  //       label: {
  //         zh_CN: '带查询',
  //         en_US: 'WithSearch',
  //       },
  //       path: '/business/with-search',
  //     },
  //     {
  //       code: 'withAside',
  //       label: {
  //         zh_CN: '带侧边栏',
  //         en_US: 'WithAside',
  //       },
  //       path: '/business/with-aside',
  //     },
  //     {
  //       code: 'withRadioCard',
  //       label: {
  //         zh_CN: '带单选卡片',
  //         en_US: 'With Nav Tabs',
  //       },
  //       path: '/business/with-radio-cards',
  //     },
  //     {
  //       code: 'withTabs',
  //       label: {
  //         zh_CN: '带选项卡',
  //         en_US: 'With Tabs',
  //       },
  //       path: '/business/with-tabs',
  //     },
  //   ],
  // },
];

mock.mock('/user/menu', 'get', intercepter(mockMenuList));
