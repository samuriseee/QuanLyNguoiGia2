import 'dayjs/locale/zh-cn';
import { ConfigProvider, Spin, theme as antdTheme, notification } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import dayjs from 'dayjs';
import { Suspense, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { HistoryRouter, history } from '@/routes/history';
import { LocaleFormatter, localeConfig } from './locales';
import RenderRouter from './routes';
import { setGlobalState } from './stores/global.store';
import { io } from 'socket.io-client';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface SensorData {
  Bpm: number;
  SpO2: number;
  Alarm: number;
}

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
});

const App: React.FC = () => {
  const { locale } = useSelector(state => state.user);
  const { theme, loading } = useSelector(state => state.global);
  const dispatch = useDispatch();
  const [sensorData, setSensorData] = useState({
    sensor1: { temperature: 0, Oxy: 0, Bpm: 0, SpO2: 0, Alarm: 0 },
  });
  const [prevSensorData, setPrevSensorData] = useState<SensorData | null>(null);

  const [sensor1Data, setSensor1Data] = useState({ temperature: 0, Oxy: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('loggedIn') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  console.log('socket:', socket);

  useEffect(() => {
    socket.on('sensorData', data => {
      setSensorData(data);
    });

    return () => {
      socket.off('sensorData');
    };
  }, []);

  useEffect(() => {
    setSensor1Data(sensorData.sensor1);
  }, [sensorData]);

  useEffect(() => {
    console.log('Updated sensor data:', sensor1Data.Oxy.toFixed(2));
  }, [sensor1Data]);
  console.log('sensor1Data:', sensor1Data);

  const playSound = () => {
    const audio = new Audio('/public/sound.mp3');

    audio.play();
  };

  const showNotification = (conditionCode: any, data: any, namesString: string) => {
    playSound();
    let description = '';

    switch (conditionCode) {
      case 1:
        description = `Người cao tuổi ${namesString} Nhịp tim hiện tại: ${data}`;
        break;
      case 2:
        description = `Người cao tuổi ${namesString} Nồng độ oxi trong máu: ${data}`;
        break;
      case 3:
        description = `Người cao tuổi ${namesString} Alarm: Thông báo té ngã`;
        break;
      case 4:
        description = `Người cao tuổi ${namesString} Nhịp tim hiện tại trên 120: ${data}`;
        break;
    }

    notification.error({
      message: 'Alert',
      description,
      placement: 'topRight',
      duration: 0,
      style: {
        backgroundColor: '#ff4d4f',
        color: '#fff',
      },
    });
  };

  const peopleWithNonDefaultSensor =
    sensorData.sensor1 &&
    (sensorData.sensor1.temperature !== 0 ||
      sensorData.sensor1.Oxy !== 0 ||
      sensorData.sensor1.Bpm !== 0 ||
      sensorData.sensor1.SpO2 !== 0 ||
      sensorData.sensor1.Alarm !== 0);
  const namesWithNonDefaultSensor = peopleWithNonDefaultSensor ? ['Name'] : [];
  const uniqueNames = [...new Set(namesWithNonDefaultSensor)];
  const namesString = uniqueNames.join(', ');

  useEffect(() => {
    const { Bpm, SpO2, Alarm } = sensorData.sensor1;

    if (Bpm !== 0 || SpO2 !== 0 || Alarm !== 0) {
      if (prevSensorData && JSON.stringify(prevSensorData) === JSON.stringify(sensorData.sensor1)) {
        return; // Dữ liệu mới giống dữ liệu trước đó, không cần gọi lại showNotification
      }

      if (Bpm < 60 || Bpm > 100 || SpO2 < 90 || Alarm === 1) {
        let conditionCode = 0;
        let dataToShow: number | null = null;

        if (Bpm < 60 && Bpm > 20) {
          conditionCode = 1;
          dataToShow = Bpm;
        } else if (Bpm > 120) {
          conditionCode = 1;
          dataToShow = Bpm;
        } else if (SpO2 < 90 && SpO2 > 20) {
          conditionCode = 2;
          dataToShow = SpO2;
        } else if (Alarm === 1) {
          conditionCode = 3;
        } else if (Bpm > 120) {
          conditionCode = 4;
          dataToShow = Bpm;
        }

        showNotification(conditionCode, dataToShow, namesString);
      }

      setPrevSensorData(sensorData.sensor1);
    }
  }, [sensorData, prevSensorData, namesString]);

  // const emergencyData = sensorData.sensor1.Oxy.toFixed(2);

  // useEffect(() => {
  //   if (Number(emergencyData) < 90) {
  //     showNotification(emergencyData);
  //   }
  // }, [emergencyData]);
  // console.log(emergencyData);

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    setIsLoggedIn(false);
  };

  const setTheme = (dark = true) => {
    dispatch(
      setGlobalState({
        theme: dark ? 'dark' : 'light',
      }),
    );
  };

  /** initial theme */
  useEffect(() => {
    setTheme(theme === 'dark');

    // watch system theme change
    if (!localStorage.getItem('theme')) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');

      function matchMode(e: MediaQueryListEvent) {
        setTheme(e.matches);
      }

      mql.addEventListener('change', matchMode);
    }
  }, []);

  // set the locale for the user
  // more languages options can be added here
  useEffect(() => {
    if (locale === 'en_US') {
      dayjs.locale('en');
    } else if (locale === 'zh_CN') {
      dayjs.locale('zh-cn');
    }
  }, [locale]);

  /**
   * handler function that passes locale
   * information to ConfigProvider for
   * setting language across text components
   */
  const getAntdLocale = () => {
    if (locale === 'en_US') {
      return enUS;
    } else if (locale === 'zh_CN') {
      return zhCN;
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      const { pathname } = history.location;
      if (pathname !== '/login' && pathname !== '/register') {
        history.push('/login');
      }
    }
  }, [isLoggedIn]);

  return (
    <ConfigProvider
      locale={getAntdLocale()}
      componentSize="middle"
      theme={{
        token: { colorPrimary: '#13c2c2' },
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <IntlProvider locale={locale.split('_')[0]} messages={localeConfig[locale]}>
        <HistoryRouter history={history}>
          <Suspense fallback={null}>
            <Spin
              spinning={loading}
              className="app-loading-wrapper"
              style={{
                backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.44)' : 'rgba(255, 255, 255, 0.44)',
              }}
              tip={<LocaleFormatter id="gloabal.tips.loading" />}
            ></Spin>
            <RenderRouter
              sensorData={sensor1Data}
              showNotification={showNotification}
              onLogin={() => setIsLoggedIn(true)}
            />
          </Suspense>
        </HistoryRouter>
      </IntlProvider>
    </ConfigProvider>
  );
};

export default App;
