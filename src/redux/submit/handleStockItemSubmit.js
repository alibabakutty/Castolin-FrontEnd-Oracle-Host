export const handleStockItemSubmit = async (e, mode, stockItemData, dispatch, navigate, datas, inputRef) => {
    if (e) e.preventDefault();

    // For display mode, just navigate back immediately
    if (mode === 'display') {
        navigate(-1);
        return;
    }

    // Rest of the logic only applies to create/update modes
    if (!stockItemData || !stockItemData.item_name || !stockItemData.item_name.trim()) {
        alert('Item Name is required.');
        if (inputRef?.current?.[1]) {
            inputRef.current[1].focus();
        }
        return;
    }

    try {
        if (mode === 'create') {
            console.log('Creating stock item:', stockItemData);
            if (inputRef?.current?.[0]) {
                inputRef.current[0].focus();
            }
        } else if (mode === 'update') {
            console.log('Updating stock item:', stockItemData);
            navigate(-1);
        }
    } catch (error) {
        console.error('Error during submission:', error);
        alert('An error occurred during submission. Please try again.');
    }
}

export default handleStockItemSubmit;