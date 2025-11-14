import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RightSideButton from '../../components/right-side-button/RightSideButton';
import LeftSideMenu from '../../components/right-side-button/LeftSideMenu';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/ContextProvider';
import { toast } from 'react-toastify';
import { setModeDistributorData, updateFieldDistributorData } from '../slices/distributorSlice';
import { fetchDistributorById } from '../thunks/distributorThunks';
import handleDistributorSubmit from '../submit/handleDistributorSubmit';

const DistributorMaster = () => {
  const { distributorData, mode } = useSelector((state) => state.distributorData);
  const  { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const { signup } = useAuth();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/distributor-master') {
      dispatch(setModeDistributorData('create'));
    } else if (path.startsWith('/distributor-view')) {
      dispatch(setModeDistributorData('display'));
    } else if (path.startsWith('/distributor-alter')) {
      dispatch(setModeDistributorData('update'));
    }
  }, [dispatch]);

  useEffect(() => {
    if (inputRef.current[0]) {
      inputRef.current[0].focus();
      inputRef.current[0].setSelectionRange(0, 0);
    }
  }, []);

  useEffect(() => {
    if (mode === 'display' || mode === 'update') {
      dispatch(fetchDistributorById(id));
    }
  }, [mode, id, dispatch]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    dispatch(updateFieldDistributorData({ name, value }));
  };

  const handleKeyDown = (e, index) => {
    const key = e.key;
    const { value, selectionStart } = e.target;
    
    if (key === 'Enter') {
      e.preventDefault();
      if (e.target.value.trim() !== '') {
        const nextField = index + 1;

        if (nextField < inputRef.current.length) {
          inputRef.current[nextField].focus();
          inputRef.current[nextField].setSelectionRange(0, 0);
        } else if (e.target.name === 'password') {
          const userConfirmed = window.confirm('Do you want to confirm this submit?');
          if (userConfirmed) {
            handleSubmit(e);
          } else {
            e.preventDefault();
          }
        }
      }
    } else if (key === 'Backspace') {
      if (selectionStart === 0 && index > 0) {
        e.preventDefault();
        const prevField = index - 1;
        inputRef.current[prevField].focus();
        inputRef.current[prevField].setSelectionRange(0, 0);
      } else if (selectionStart > 0) {
        const newValue = value.slice(0, selectionStart - 1) + value.slice(selectionStart);
        e.target.value = newValue;
        updateFieldDistributorData({ name: e.target.name, value: newValue });
        // move the cursor back by position
        e.target.setSelectionRange(selectionStart - 1, selectionStart - 1);
      }
    } else if (key === 'Escape') {
      navigate(-1);
    }
  };

  // DistributorMaster.jsx - Fix the handleSubmit function
const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For create mode, handle Firebase signup first
    if (mode === 'create') {
        try {
            const result = await signup(
                distributorData.username,
                distributorData.email,
                distributorData.password,
                "distributor",
                distributorData.mobile_number
            );

            if (result.success) {
                toast.success('Distributor created successfully!', {
                  position: 'bottom-right',
                  autoClose: 3000
                });
                dispatch(setModeDistributorData('create')); // Reset form
                // Clear form
                dispatch(updateFieldDistributorData({ name: 'username', value: '' }));
                dispatch(updateFieldDistributorData({ name: 'mobile_number', value: '' }));
                dispatch(updateFieldDistributorData({ name: 'email', value: '' }));
                dispatch(updateFieldDistributorData({ name: 'password', value: '' }));
                
                if (inputRef.current[0]) {
                    inputRef.current[0].focus();
                }
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create distributor');
        }
    } else {
        // For update mode, use the handleDistributorSubmit
        try {
            await handleDistributorSubmit(e, mode, distributorData, dispatch, navigate, id, inputRef);
        } catch (error) {
            toast.error(error.message || 'Failed to update distributor');
        }
    }
};

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen flex bg-[#493D9E] font-amasis">
      <LeftSideMenu />
      {/* Back Button in Top Left Corner */}
      <div className="absolute top-4 left-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <form action="" onSubmit={handleSubmit} className="w-[25%] h-[20vh] ml-[68px] bg-[#FBFBFB]">
        <div className='text-[13px] flex mt-2 ml-2 leading-4'>
          <label htmlFor="username" className='w-[34%]'>Distributor Name</label>
          <span>:</span>
          <input type="text" name='username' value={distributorData.username || ''} ref={(input) => (inputRef.current[0] = input)} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, 0)} className='w-[200px] ml-2 pl-0.5 h-5 font-medium text-[13px] capitalize focus:bg-yellow-200 focus:outline-none focus:border-blue-500 focus:border border border-transparent' autoComplete='off' readOnly={mode === 'display'} />
        </div>
        <div className='text-[13px] flex mt-2 ml-2 leading-4'>
          <label htmlFor="mobile_number" className='w-[34%]'>Mobile Number</label>
          <span>:</span>
          <input type="text" name='mobile_number' value={distributorData.mobile_number || ''} ref={(input) => (inputRef.current[1] = input)} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, 1)} className='w-[200px] ml-2 pl-0.5 h-5 font-medium text-[13px] capitalize focus:bg-yellow-200 focus:outline-none focus:border-blue-500 focus:border border border-transparent' autoComplete='off' readOnly={mode === 'display'} />
        </div>
        <div className='text-[13px] flex mt-2 ml-2 leading-4'>
          <label htmlFor="" className='w-[34%]'>Email</label>
          <span>:</span>
          <input type="text" name='email' value={distributorData.email || ''} ref={(input) => (inputRef.current[2] = input)} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, 2)} className='w-[200px] ml-2 pl-0.5 h-5 font-medium text-[13px] focus:bg-yellow-200 focus:outline-none focus:border-blue-500 focus:border border border-transparent' autoComplete='off' readOnly={mode === 'display'} />
        </div>
        <div className='text-[13px] flex mt-2 ml-2 leading-4'>
          <label htmlFor="" className='w-[34%]'>Password</label>
          <span>:</span>
          <input type="text" name='password' value={distributorData.password || ''} ref={(input) => (inputRef.current[3] = input)} onChange={handleInputChange} onKeyDown={(e) => handleKeyDown(e, 3)} className='w-[200px] ml-2 pl-0.5 h-5 font-medium text-[13px] capitalize focus:bg-yellow-200 focus:outline-none focus:border-blue-500 focus:border border border-transparent' autoComplete='off' readOnly={mode === 'display'} />
        </div>
      </form>
      <RightSideButton />
    </div>
  );
};

export default DistributorMaster;
