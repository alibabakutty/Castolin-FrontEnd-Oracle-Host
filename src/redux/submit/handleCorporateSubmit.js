import { toast } from "react-toastify";


export const handleCorporateSubmit = async (e, mode, corporateData, dispatch, navigate, datas, inputRef) => {
    if (e) e.preventDefault();

    // for display mode, just navigate back immediately
    if (mode === 'display') {
        navigate(-1);
        return;
    }

    if (!corporateData || !corporateData.username || !corporateData.username.trim()) {
        alert("Corporate name is required.");
        if (inputRef?.current?.[1]) {
            inputRef.current[1].focus();
        }
        return;
    }

    try {
        if (mode === 'create') {
            // signup for new corporate into corporates table
            const result = await signup(
                corporateData.username,
                corporateData.password,
                'corporate'
            );

            if (result === 'success') {
                toast.success("Corporate signed up successfully!")
            }
            console.log("Creating corporate master", corporateData);

            if (inputRef?.current?.[0]) {
                inputRef.current[0].focus();
            }
        } else if (mode === 'update') {
            navigate(-1);
        }
    } catch (error) {
        console.error("Error during submission:", error);
    }
};

export default handleCorporateSubmit;