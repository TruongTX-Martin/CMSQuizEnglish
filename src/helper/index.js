import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';

const showAlert = (title, message, callback) => {
  confirmAlert({
    title: title,
    message: message,
    buttons: [
      {
        label: 'Yes',
        onClick: () => callback(true)
      },
      {
        label: 'No',
        onClick: () => callback(false)
      }
    ]
  });
};

const Helper = {
  showAlert
}

export default Helper;

