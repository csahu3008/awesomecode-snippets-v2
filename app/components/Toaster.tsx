import { toast } from 'sonner';

export function CustomToast(type:'error'|'success'|'info', msg:string) {
  switch (type) {
    case 'success':
      toast.success(msg, {
        style: { border: '2px solid black', color: 'black', opacity: 1, background: '#02e041' },
      });
      break;
    case 'error':
      toast.error(msg, {
        style: { border: '2px solid black', color: 'black', opacity: 1, background: '#db0433' },
      });
      break;
    case 'info':
        toast.info(msg, {
        style: { border: '2px solid black', color: 'black', opacity: 1, background: '#f6fa05' },
      });
      break;
    default:
      toast(msg, { style: {} });
  }
}
