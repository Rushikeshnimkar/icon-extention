import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { hideToast } from '../store/slices/toastSlice';
import Toast from './common/Toast';

const ToastContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { message, type, isVisible } = useSelector((state: RootState) => state.toast);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible || !message) {
    return null;
  }

  return (
    <Toast
      message={message}
      type={type}
      onClose={() => dispatch(hideToast())}
    />
  );
};

export default ToastContainer; 