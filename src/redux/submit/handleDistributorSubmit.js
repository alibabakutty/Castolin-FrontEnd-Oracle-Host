import { toast } from 'react-toastify';

export const handleDistributorSubmit = async (e, mode, distributorData, navigate, inputRef) => {
  if (e) e.preventDefault();

  // For display mode, just navigate back immediately
  if (mode === 'display') {
    navigate(-1);
    return;
  }

  if (!distributorData || !distributorData.username || !distributorData.username.trim()) {
    alert('Distributor Name is required.');
    if (inputRef?.current?.[1]) {
      inputRef.current[1].focus();
    }
    return;
  }
  try {
    if (mode === 'create') {
      // signup for new distributor into users table
      const result = await signup(
        distributorData.usercode,
        distributorData.username,
        distributorData.password,
        'distributor',
      );

      if (result === 'success') {
        toast.success('Distributor signed up successfully!');
      }
      console.log('Creating distributor master', distributorData);

      if (inputRef?.current?.[0]) {
        inputRef.current[0].focus();
      }
    } else if (mode === 'update') {
      navigate(-1);
    }
  } catch (error) {
    console.error('Eror during submission:', error);
  }
};

export default handleDistributorSubmit;
