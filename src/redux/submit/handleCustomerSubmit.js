
export const handleCustomerSubmit = async (e, mode, customerData, dispatch, navigate, datas, inputRef) => {
    if (e) e.preventDefault();

    // For display mode, just navigate back immediately
    if (mode === 'display') {
        navigate(-1);
        return;
    }

    if (!customerData || !customerData.customer_name || !customerData.customer_name.trim()) {
        alert('Customer Name is required.');
        if (inputRef?.current?.[1]) {
            inputRef.current[1].focus();
        }
        return;
    }
    try {
        if (mode === 'create') {
            console.log('Creating customer data:', customerData);
            if (inputRef?.current?.[0]) {
                inputRef.current[0].focus();
            } 
        } else if (mode === 'update') {
            console.log('Updating customer data:', customerData);
            navigate(-1);
        }
    } catch (error) {
        console.error('Error during submission:', error);
    }
};

export default handleCustomerSubmit;