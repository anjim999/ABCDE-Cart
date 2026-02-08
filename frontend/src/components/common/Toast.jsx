import { useEffect } from 'react';
import { CheckCircle, X, Sparkles } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <X className="w-5 h-5 text-red-400" />,
    info: <Sparkles className="w-5 h-5 text-primary-400" />,
  };

  const styles = {
    success: 'border-emerald-500/50',
    error: 'border-red-500/50',
    info: 'border-primary-500/50',
  };

  return (
    <div className={`toast ${styles[type]}`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-dark-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
