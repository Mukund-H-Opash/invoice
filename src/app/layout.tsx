
'use client';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body style={{ margin: 0, padding: 0,border: 0, }}>
        <Provider store={store}>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </Provider>
      </body>
    </html>
  );
}