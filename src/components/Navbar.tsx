'use client';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const Navbar = () => {
  const router = useRouter();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Create Invoice', path: '/create-invoice' },
    { label: 'All Invoices', path: '/all-invoices' },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)', 
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: '20px',
      }}
    >   
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1,
        }}
      >
        {/* Logo/Title */}
        <Typography
          variant="h6"
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            color: '#fff',
            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer',
          }}
          onClick={() => router.push('/')}
        >
          Invoice Maker
        </Typography>

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, md: 2 },
            flexWrap: 'wrap', // Responsive wrapping for small screens
          }}
        >
          {navItems.map((item) => (
            <Button
              key={item.label}
              component={motion.button}
              whileHover={{ scale: 1.1, boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              sx={{
                color: '#fff',
                fontWeight: 'medium',
                fontSize: { xs: '0.9rem', md: '1rem' },
                textTransform: 'none',
                padding: { xs: '6px 12px', md: '8px 16px' },
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.1)', // Subtle background
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                },
              }}
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;