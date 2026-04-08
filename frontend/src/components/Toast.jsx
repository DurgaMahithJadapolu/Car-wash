import React from 'react';

const Toast = ({ message, variant = 'main' }) => {
  const cls = variant === 'auth' ? 'auth-toast' : 'toast';
  return (
    <div className={`${cls}${message ? ' show' : ''}`}>
      {message}
    </div>
  );
};

export default Toast;
