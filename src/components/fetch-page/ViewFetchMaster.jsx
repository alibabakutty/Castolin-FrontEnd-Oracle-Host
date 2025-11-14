import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

const ViewFetchMaster = () => {
  const { type } = useParams();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const searchInputRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const listRef = useRef(null);

  // Configuration for different module types
  const moduleConfig = {
    inventory: {
      title: 'Inventory Items',
      apiEndpoint: '/stock_item',
      searchPlaceholder: 'Search by item code, item name, description, category...',
      itemName: 'items',
      createLink: '/inventory-master',
      fields: {
        primary: 'stock_item_name',
        code: 'item_code',
        category: 'category',
        quantity: 'quantity',
        price: 'price',
        description: 'description',
      },
    },
    customer: {
      title: 'Customers',
      apiEndpoint: '/customer',
      searchPlaceholder: 'Search by customer name, email, phone...',
      itemName: 'customers',
      createLink: '/customer-master',
      fields: {
        primary: 'customer_name',
        code: 'customer_code',
        email: 'email',
        phone: 'phone',
        address: 'address',
        company: 'company_name',
      },
    },
    distributor: {
      title: 'Distributors',
      apiEndpoint: '/distributors',
      searchPlaceholder: 'Search by name, email, or role...',
      itemName: 'distributors',
      createLink: '/distributor-master',
      fields: {
        primary: 'username',
        email: 'email',
        role: 'role',
        status: 'status',
        department: 'department',
      },
    },
    corporate: {
      title: 'Corporates',
      apiEndpoint: '/corporates',
      searchPlaceholder: 'Search by Name, email or role...',
      itemName: 'corporates',
      createLink: '/corporate-master',
      fields: {
        primary: 'username',
        email: 'email',
        role: 'role',
        status: 'status',
        department: 'department',
      },
    },
  };

  const typeNames = {
    inventory: 'Inventories',
    customer: 'Customers',
    distributor: 'Distributors',
    corporate: 'Corporates',
  };

  // Get current module configuration
  const currentModule = moduleConfig[type];

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = e => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => {
            const newIndex = Math.max(0, prev - 1);
            scrollToItem(newIndex);
            return newIndex;
          });
          break;

        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => {
            const newIndex = Math.min(filteredData.length - 1, prev + 1);
            scrollToItem(newIndex);
            return newIndex;
          });
          break;

        case 'Escape':
          e.preventDefault();
          navigate(-1);
          break;

        case 'Enter':
          e.preventDefault();
          if (filteredData[selectedIndex]) {
            handleItemClick(filteredData[selectedIndex], selectedIndex);
          }
          break;

        default:
          break;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredData, selectedIndex, navigate]);

  // Scroll to selected item
  const scrollToItem = index => {
    if (listRef.current) {
      const items = listRef.current.querySelectorAll('li');
      if (items[index]) {
        items[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  };

  // Reset selected index when data changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredData]);

  // Filter data function with useCallback to prevent unnecessary re-renders
  const filterData = useCallback(
    (dataToFilter, searchValue) => {
      if (!currentModule || !dataToFilter) return [];

      if (searchValue.trim() === '') {
        return dataToFilter;
      } else {
        return dataToFilter.filter(item => {
          return Object.values(currentModule.fields).some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(searchValue.toLowerCase());
          });
        });
      }
    },
    [currentModule],
  );

  // Single useEffect for data fetching - optimized
  useEffect(() => {
    // Skip if no type or module config
    if (!type || !currentModule || hasFetched) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Don't clear data immediately to avoid blinking
        console.log(`Fetching data for: ${type}`);

        const response = await api.get(currentModule.apiEndpoint);

        // Batch state updates
        setData(response.data);
        setFilteredData(response.data);
        setHasFetched(true);
        console.log(`${currentModule.title} data:`, response.data);
      } catch (error) {
        console.error(`Error fetching ${currentModule.title.toLowerCase()}:`, error);
        setError(`Failed to fetch ${currentModule.title.toLowerCase()}`);
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, currentModule, hasFetched]);

  // Filter data based on search term - optimized
  useEffect(() => {
    if (data.length > 0) {
      const filtered = filterData(data, searchTerm);
      setFilteredData(filtered);
    }
  }, [searchTerm, data, filterData]);

  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  const formatType = str => {
    if (!str) return '';
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleInventoryClick = item => {
    navigate(`/inventory-view/${item.item_code}`);
  };

  const handleCustomerClick = item => {
    navigate(`/customer-view/${item.customer_code}`);
  };

  const handleDistributorClick = item => {
    navigate(`/distributor-view/${item.id}`);
  };

  const handleCorporateClick = item => {
    navigate(`/corporate-view/${item.id}`);
  };

  // Handle item click based on type
  const handleItemClick = (item, index) => {
    setSelectedIndex(index);

    switch (type) {
      case 'inventory':
        handleInventoryClick(item);
        break;
      case 'customer':
        handleCustomerClick(item);
        break;
      case 'distributor':
        handleDistributorClick(item);
        break;
      case 'corporate':
        handleCorporateClick(item);
      default:
        break;
    }
  };

  // Render list items based on type
  const renderListItem = (item, index) => {
    if (!currentModule) return null;

    const isSelected = index === selectedIndex;

    const getItemContent = () => {
      switch (type) {
        case 'inventory':
          return (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-[12px] text-gray-800">{`${item.item_code}-${item.stock_item_name}`}</p>
                {item.category && (
                  <p className="text-xs text-gray-600">
                    Category: <span className="text-blue-600">{item.category}</span>
                  </p>
                )}
                {item.quantity !== undefined && (
                  <p className="text-xs text-gray-600">
                    Qty:{' '}
                    <span
                      className={
                        item.quantity > 10
                          ? 'text-green-600'
                          : item.quantity > 0
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }
                    >
                      {item.quantity}
                    </span>
                  </p>
                )}
                {item.price !== undefined && (
                  <p className="text-xs text-gray-600">
                    Price:{' '}
                    <span className="text-green-600 font-medium">
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </span>
                  </p>
                )}
              </div>
            </div>
          );

        case 'customer':
          return (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-[12px] text-gray-800">{`${item.customer_code}-${item.customer_name}`}</p>
                {item.phone && (
                  <p className="text-xs text-gray-600">
                    Phone: <span className="text-gray-800">{item.phone}</span>
                  </p>
                )}
                {item.company_name && (
                  <p className="text-xs text-gray-600">
                    Company: <span className="text-purple-600">{item.company_name}</span>
                  </p>
                )}
              </div>
            </div>
          );

        case 'distributor':
          return (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-xs text-gray-800">{`${item.username.toUpperCase()}-${
                  item.email
                }`}</p>
                {item.status && (
                  <p className="text-xs text-gray-600">
                    Status:{' '}
                    <span className={item.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                      {item.status}
                    </span>
                  </p>
                )}
                {item.department && (
                  <p className="text-xs text-gray-600">
                    Department: <span className="text-purple-600">{item.department}</span>
                  </p>
                )}
              </div>
            </div>
          );

        case 'corporate':
          return (
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-xs text-gray-800">{`${item.username.toUpperCase()}-${
                  item.email
                }`}</p>
                {item.status && (
                  <p className="text-xs text-gray-600">
                    Status:{' '}
                    <span className={item.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                      {item.status}
                    </span>
                  </p>
                )}
                {item.department && (
                  <p className="text-xs text-gray-600">
                    Department: <span className="text-purple-600">{item.department}</span>
                  </p>
                )}
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <li
        key={item.id || item.item_code || item.customer_code || index}
        className={`border-b border-gray-300 py-1 px-3 transition-colors cursor-pointer ${
          isSelected ? 'bg-yellow-100 border-yellow-300' : 'hover:bg-blue-50'
        }`}
        onClick={() => handleItemClick(item, index)}
      >
        {getItemContent()}
        {item.description && type === 'inventory' && (
          <p className="text-xs text-gray-500 mt-1 italic">{item.description}</p>
        )}
        {item.address && type === 'customer' && (
          <p className="text-xs text-gray-500 mt-1">{item.address}</p>
        )}
      </li>
    );
  };

  // Main render with stable conditional rendering
  const renderContent = () => {
    if (loading && !hasFetched) {
      return (
        <div className="h-[70vh] flex items-center justify-center">
          <div className="text-gray-500">Loading {currentModule?.title.toLowerCase()}...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="h-[70vh] flex items-center justify-center">
          <div className="text-red-600 text-center">
            <p>Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (!currentModule) {
      return (
        <div className="h-[70vh] flex items-center justify-center">
          <div className="text-red-600">Invalid module type</div>
        </div>
      );
    }

    return (
      <div className="h-[78vh] overflow-y-auto" ref={listRef}>
        <div>
          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              {searchTerm ? 'No items match your search.' : `No ${currentModule.itemName} found.`}
            </div>
          ) : (
            <ul className="divide-y divide-gray-300">
              {filteredData.map((item, index) => renderListItem(item, index))}
            </ul>
          )}
        </div>
        {/* Results count */}
        <div className="p-2 border-t border-gray-300 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            Showing {filteredData.length} of {data.length} {currentModule.itemName}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex font-amasis">
      <div className="w-[100%] h-[100vh] flex">
        <div className="w-1/2 bg-gradient-to-t to-blue-500 from-[#ccc]">
          <button
            onClick={() => navigate(-1)}
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
        <div className="w-1/2 bg-slate-100 border border-1-blue-400 flex justify-center flex-col items-center">
          <div className="w-[50%] h-16 flex flex-col justify-center items-center border border-black bg-white border-b-0">
            <p className="text-[13px] font-semibold underline underline-offset-4 decoration-gray-400 text-gray-700">
              {formatType(type)} Display
            </p>
            <input
              type="text"
              placeholder={currentModule?.searchPlaceholder || 'Search...'}
              value={searchTerm}
              ref={searchInputRef}
              onChange={handleSearchChange}
              className="w-[250px] ml-2 mt-2 h-5 capitalize font-medium pl-1 text-sm focus:bg-yellow-200 focus:border focus:border-blue-500 focus:outline-0 relative z-10"
              autoComplete="off"
            />
          </div>
          <div className="w-[350px] h-[89vh] border border-gray-600 bg-[#def1fc]">
            <h2 className="p-1 bg-[#2a67b1] text-white text-left text-[13px] pl-3">
              List of {typeNames[type] || 'Items'}
            </h2>
            <div className="border border-b-slate-400 flex justify-between px-2 py-1">
              <div className="w-full">
                <button
                  onClick={() => navigate(currentModule?.createLink || '#')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Create
                </button>
              </div>
              <div className="w-full text-right">
                <button
                  onClick={() => navigate('/admin')}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Home
                </button>
              </div>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFetchMaster;
