import { toast } from 'react-toastify';
import { updateDistributor } from '../../auth/auth';



export const handleDistributorSubmit = async (e, mode, distributorData, dispatch, navigate, usercode, inputRef, setModeDistributorData) => {
  if (e) e.preventDefault();

  console.log('🔍 [DEBUG] handleDistributorSubmit called with mode:', mode);

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

  // Validate password
  if (!distributorData.password || distributorData.password.length < 6) {
    toast.error('Password must be at least 6 characters long');
    return;
  }

  try {
    if (mode === 'create') {
      console.log('Creating distributor master', distributorData);
      if (inputRef?.current?.[0]) {
        inputRef.current[0].focus();
      }
    } else if (mode === 'update') {
      console.log('🔍 [DEBUG] Starting distributor signup process...');
      
      // Use the new signupDistributor function with only username and password
      const result = await updateDistributor(
        distributorData.usercode,
        distributorData.username, // Only username
        distributorData.password  // Only password
      );

      if (result.success) {
        toast.success('Distributor signed up successfully! Firebase account created.');
        
        // Reset form and navigate back
        dispatch(setModeDistributorData('create'));
        dispatch(updateFieldDistributorData({ name: 'username', value: '' }));
        dispatch(updateFieldDistributorData({ name: 'mobile_number', value: '' }));
        dispatch(updateFieldDistributorData({ name: 'email', value: '' }));
        dispatch(updateFieldDistributorData({ name: 'password', value: '' }));

        navigate(-1);
      } else {
        toast.error(result.message || 'Failed to sign up distributor');
      }
    }
  } catch (error) {
    console.error('❌ [DEBUG] Error during submission:', error);
    
    // Handle specific errors
    if (error.code === 'auth/email-already-in-use') {
      toast.error('This distributor is already registered in Firebase.');
    } else if (error.code === 'auth/invalid-email') {
      toast.error('Invalid email in distributor data. Please contact administrator.');
    } else if (error.message.includes('Distributor not found')) {
      toast.error('Distributor not found in database. Please create distributor first.');
    } else if (error.message.includes('No email found')) {
      toast.error('No email found for distributor. Please add email to distributor data.');
    } else {
      toast.error(error.message || 'Failed to process distributor');
    }
  }
};

export default handleDistributorSubmit;