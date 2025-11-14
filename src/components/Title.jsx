import { useNavigate } from 'react-router-dom';
import { HiXMark, HiArrowLeft } from 'react-icons/hi2';

const Title = ({ title, nav }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // If `nav` is a function (like onBack), call it
    if (typeof nav === 'function') {
      nav();
    }
    // If `nav` is -1 or a route string, navigate accordingly
    else if (nav === -1) {
      navigate(-1);
    } else if (typeof nav === 'string') {
      navigate(nav);
    }
  };

  const handleClose = () => {
     // If `nav` is a function (like onBack), call it
    if (typeof nav === 'function') {
      nav();
    }
    // If `nav` is -1 or a route string, navigate accordingly
    else if (nav === -1) {
      navigate(-1);
    } else if (typeof nav === 'string') {
      navigate(nav);
    }
  };

  return (
    <div className="bg-[#88bee6] w-[100%] h-4 flex items-center justify-between px-2 sticky z-[1]">
      {/* Left Back Arrow */}
      <HiArrowLeft
        onClick={handleBack}
        className="text-gray-800 hover:text-gray-900 cursor-pointer w-4 h-4"
        title="Go Back"
      />

      {/* Title */}
      <h1 className="text-[11px] font-amasis text-gray-800">{title}</h1>

      {/* Right Close Icon */}
      <HiXMark
        onClick={handleClose}
        className="text-gray-800 hover:text-gray-900 cursor-pointer w-4 h-4"
        title="Close"
      />
    </div>
  );
};

export default Title;