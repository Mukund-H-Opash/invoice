import { Box } from '@mui/material';
import { Providers } from '../redux/provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ 
        backgroundColor: '#0A0A0A',
        color: '#E5E7EB',
        margin: 0,
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
      }}>
        <Providers>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flex: 1, p: 2 }}>{children}</Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}