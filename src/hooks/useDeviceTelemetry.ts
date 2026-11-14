import { useState, useEffect } from 'react';

function parseCarrierName(isp: string): string | null {
  if (!isp) return null;
  const s = isp.toLowerCase();
  if (s.includes('airtel')) return 'Airtel';
  if (s.includes('jio')) return 'Jio';
  if (s.includes('verizon')) return 'Verizon';
  if (s.includes('at&t') || s.includes('att')) return 'AT&T';
  if (s.includes('t-mobile')) return 'T-Mobile';
  if (s.includes('vodafone') || s.includes('vi ')) return 'Vodafone';
  if (s.includes('ee ')) return 'EE';
  if (s.includes('o2')) return 'O2';
  if (s.includes('three')) return 'Three';
  if (s.includes('telekom')) return 'Telekom';
  if (s.includes('orange')) return 'Orange';
  if (s.includes('comcast')) return 'Xfinity';
  if (s.includes('charter') || s.includes('spectrum')) return 'Spectrum';
  if (s.includes('bsnl')) return 'BSNL';
  if (s.includes('telstra')) return 'Telstra';
  if (s.includes('singtel')) return 'Singtel';
  if (s.includes('docomo')) return 'NTT DOCOMO';
  if (s.includes('softbank')) return 'SoftBank';

  const firstWord = isp.split(/[\s,.-]+/)[0].replace(/[^a-zA-Z0-9]/g, '');
  return firstWord.length >= 3 ? firstWord : null;
}

function getTimezoneCarrier(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('India')) return 'Airtel';
    if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago')) return 'Verizon';
    if (tz.includes('London')) return 'EE';
    if (tz.includes('Berlin') || tz.includes('Paris')) return 'Vodafone';
    if (tz.includes('Tokyo')) return 'NTT DOCOMO';
    if (tz.includes('Sydney') || tz.includes('Melbourne')) return 'Telstra';
    if (tz.includes('Singapore')) return 'Singtel';
    if (tz.includes('Toronto') || tz.includes('Vancouver')) return 'Rogers';
  } catch {
    // ignore
  }
  return 'NOKIA';
}

export interface DeviceTelemetry {
  batteryLevel: number;
  isCharging: boolean;
  batterySupported: boolean;
  isOnline: boolean;
  connectionType: 'wifi' | 'cellular' | 'offline';
  networkGen: string;
  downlinkSpeed: number;
  signalBars: number;
  isTransferring: boolean;
  carrierName: string;
  setCarrierName: (name: string) => void;
}

export function useDeviceTelemetry(): DeviceTelemetry {
  const [batteryLevel, setBatteryLevel] = useState<number>(88);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [batterySupported, setBatterySupported] = useState<boolean>(false);

  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [connectionType, setConnectionType] = useState<'wifi' | 'cellular' | 'offline'>('wifi');
  const [networkGen, setNetworkGen] = useState<string>('4G');
  const [downlinkSpeed, setDownlinkSpeed] = useState<number>(15);
  const [signalBars, setSignalBars] = useState<number>(5);
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [carrierName, setCarrierName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('wp-carrier') || getTimezoneCarrier();
    }
    return 'NOKIA';
  });

  // 1. Live Battery Telemetry
  useEffect(() => {
    interface BatteryManager extends EventTarget {
      level: number;
      charging: boolean;
      addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
      removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
    }

    interface NavigatorWithBattery extends Navigator {
      getBattery?: () => Promise<BatteryManager>;
    }

    const nav = navigator as NavigatorWithBattery;
    if (typeof nav !== 'undefined' && typeof nav.getBattery === 'function') {
      nav.getBattery().then(batt => {
        setBatterySupported(true);
        setBatteryLevel(Math.round(batt.level * 100));
        setIsCharging(batt.charging);

        const handleLevelChange = () => setBatteryLevel(Math.round(batt.level * 100));
        const handleChargeChange = () => setIsCharging(batt.charging);

        batt.addEventListener('levelchange', handleLevelChange);
        batt.addEventListener('chargingchange', handleChargeChange);

        return () => {
          batt.removeEventListener('levelchange', handleLevelChange);
          batt.removeEventListener('chargingchange', handleChargeChange);
        };
      }).catch(() => {
        setBatterySupported(false);
      });
    }
  }, []);

  // 2. Network & Connection Speed
  useEffect(() => {
    const updateNetworkInfo = () => {
      const online = navigator.onLine;
      setIsOnline(online);

      if (!online) {
        setConnectionType('offline');
        setSignalBars(0);
        return;
      }

      interface NetworkConnection {
        effectiveType?: string;
        type?: string;
        downlink?: number;
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      }

      interface NavigatorWithConn extends Navigator {
        connection?: NetworkConnection;
        mozConnection?: NetworkConnection;
        webkitConnection?: NetworkConnection;
      }

      const nav = navigator as NavigatorWithConn;
      const conn = nav.connection || nav.mozConnection || nav.webkitConnection;

      if (conn) {
        const effective = conn.effectiveType || '4g';
        const type = conn.type || '';
        const downlink = typeof conn.downlink === 'number' ? conn.downlink : 15;
        setDownlinkSpeed(downlink);

        if (type === 'cellular' || (!type && window.innerWidth < 640 && effective !== '4g')) {
          setConnectionType('cellular');
        } else {
          setConnectionType('wifi');
        }

        if (effective === '4g') {
          setNetworkGen(downlink > 12 ? 'LTE' : '4G');
        } else if (effective === '3g') {
          setNetworkGen(downlink > 3 ? 'H+' : '3G');
        } else if (effective === '2g') {
          setNetworkGen('E');
        } else {
          setNetworkGen('G');
        }

        if (downlink >= 15) setSignalBars(5);
        else if (downlink >= 8) setSignalBars(4);
        else if (downlink >= 4) setSignalBars(3);
        else if (downlink >= 1.5) setSignalBars(2);
        else setSignalBars(1);
      } else {
        setConnectionType('wifi');
        setNetworkGen('4G');
        setDownlinkSpeed(20);
        setSignalBars(5);
      }
    };

    updateNetworkInfo();
    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);

    const nav = navigator as unknown as { connection?: { addEventListener?: (t: string, fn: () => void) => void; removeEventListener?: (t: string, fn: () => void) => void } };
    const conn = nav.connection;
    if (conn?.addEventListener) {
      conn.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
      if (conn?.removeEventListener) {
        conn.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  // 3. Data Transfer Bursts
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransferring(true);
      setTimeout(() => {
        setIsTransferring(false);
      }, 600 + Math.random() * 800);
    }, 3200 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, []);

  // 4. Auto-detect Real Cellular/ISP Carrier
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('wp-carrier')) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2600);

    fetch('https://ipwho.is/?fields=isp,org,connection', { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeout);
        const rawIsp = data.isp || data.org || data.connection?.isp || '';
        const brand = parseCarrierName(rawIsp);
        if (brand) {
          setCarrierName(brand);
          if (typeof window !== 'undefined') {
            localStorage.setItem('wp-carrier', brand);
          }
        }
      })
      .catch(() => {
        setCarrierName(getTimezoneCarrier());
      });

    return () => clearTimeout(timeout);
  }, []);

  return {
    batteryLevel,
    isCharging,
    batterySupported,
    isOnline,
    connectionType,
    networkGen,
    downlinkSpeed,
    signalBars,
    isTransferring,
    carrierName,
    setCarrierName,
  };
}