import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseApp } from '~/libs/firebase';

/**
 * @description
 * WebPushの設定を行うカスタムフック。
 */
export const useFirebaseCloudMessage = (): void => {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  const messaging = getMessaging(firebaseApp);

  navigator.serviceWorker
    .register('/m/firebase-messaging-sw.js') // カスタムパスを指定
    .then(registration => {
      return getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration, // 登録オブジェクトを渡す
      });
    })
    .then(currentToken => {
      console.log('FCM トークン:', currentToken);
      // トークンをサーバーに送る、など
    })
    .catch(err => {
      console.error('FCM トークン取得エラー:', err);
    });

  onMessage(messaging, payload => {
    console.log('Message received. ', payload);
  });
};
