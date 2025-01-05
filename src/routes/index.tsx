import type { FC } from 'react';
import type { RouteObject } from 'react-router';

import { lazy } from 'react';
import { Navigate } from 'react-router';
import { useRoutes } from 'react-router-dom';

import Dashboard from '@/pages/dashboard';
import LayoutPage from '@/pages/layout';
import LoginPage from '@/pages/login';

import WrapperRouteComponent from './config';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));
const Documentation = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/doucumentation'));
const Guide = lazy(() => import(/* webpackChunkName: "guide'"*/ '@/pages/guide'));
const RoutePermission = lazy(() => import(/* webpackChunkName: "route-permission"*/ '@/pages/permission/route'));
const FormPage = lazy(() => import(/* webpackChunkName: "form'"*/ '@/pages/components/form'));
const TablePage = lazy(() => import(/* webpackChunkName: "table'"*/ '@/pages/components/table'));
const SearchPage = lazy(() => import(/* webpackChunkName: "search'"*/ '@/pages/components/search'));
const TabsPage = lazy(() => import(/* webpackChunkName: "tabs'"*/ '@/pages/components/tabs'));
const AsidePage = lazy(() => import(/* webpackChunkName: "aside'"*/ '@/pages/components/aside'));
const RadioCardsPage = lazy(() => import(/* webpackChunkName: "radio-cards'"*/ '@/pages/components/radio-cards'));
const BusinessBasicPage = lazy(() => import(/* webpackChunkName: "basic-page" */ '@/pages/business/basic'));
const BusinessWithSearchPage = lazy(() => import(/* webpackChunkName: "with-search" */ '@/pages/business/with-search'));
const BusinessWithAsidePage = lazy(() => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-aside'));
const BusinessWithRadioCardsPage = lazy(
  () => import(/* webpackChunkName: "with-aside" */ '@/pages/business/with-radio-cards'),
);
const BusinessWithTabsPage = lazy(() => import(/* webpackChunkName: "with-tabs" */ '@/pages/business/with-tabs'));

const DoctorManagement = lazy(() => import('@/pages/EmployeeManagement/DoctorManagement'));
const DoctorDetail = lazy(() => import('@/pages/EmployeeManagement/DoctorManagement/doctorDetail'));
const NurseManagement = lazy(() => import('@/pages/EmployeeManagement/NurseManagement'));
const OldPeopleManagement = lazy(() => import('@/pages/oldPeople'));
const OldPeopleDetail = lazy(() => import('@/pages/oldPeople/oldPeopleDetail'));
const StorageManagement = lazy(() => import('@/pages/storage'));
const FoodManagement = lazy(() => import('@/pages/food'))

const getRouteList = (
  sensorData: any,
  showNotification: any,
): RouteObject[] => [
    {
      path: '/login',
      element: <WrapperRouteComponent element={<LoginPage />} titleId="title.login" />,
    },
    {
      path: '/',
      element: <WrapperRouteComponent element={<LayoutPage />} titleId="" />,
      children: [
        {
          path: '',
          element: <Navigate to="dashboard" />,
        },
        {
          path: 'dashboard',
          element: <WrapperRouteComponent element={<Dashboard />} titleId="title.dashboard" />,
        },
        {
          path: 'employee-management/doctor',
          element: <WrapperRouteComponent element={<DoctorManagement />} titleId="title.account" />,
        },
        {
          path: 'employee-management/doctor/:id',
          element: <WrapperRouteComponent element={<DoctorDetail />} titleId="title.account" />,
        },
        {
          path: 'employee-management/nurse',
          element: <WrapperRouteComponent element={<NurseManagement />} titleId="title.account" />,
        },
        {
          path: 'old-people',
          element: <WrapperRouteComponent element={<OldPeopleManagement sensor1Data={sensorData} showNotification={showNotification} />} titleId="title.account" />,
        },
        {
          path: 'old-people/:id',
          element: <WrapperRouteComponent element={<OldPeopleDetail sensor1Data={sensorData} />} titleId="title.account" />
        },
        {
          path: 'facility/storage',
          element: <WrapperRouteComponent element={<StorageManagement />} titleId="title.account" />
        },
        {
          path: 'facility/food',
          element: <WrapperRouteComponent element={<FoodManagement />} titleId="title.account" />
        },
        {
          path: '*',
          element: <WrapperRouteComponent element={<NotFound />} titleId="title.notFount" />,
        },
      ],
    },
  ];

type Props = {
  sensorData: any;
  showNotification: any;
};

const RenderRouter: FC<Props> = ({ sensorData, showNotification }) => {
  const element = useRoutes(getRouteList(
    sensorData,
    showNotification
  ));

  return element;
};

export default RenderRouter;
