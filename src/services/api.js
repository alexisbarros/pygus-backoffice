/**
 * API Post method
 * @param {object} params 
 * @property {string} route
 * @property {object} body
 * @property {object} headers
 */
export const post = async (params) => {
    const apiResponse = await fetch(params.route,
        {
            headers: params.headers,
            method: 'POST',
            body: params.body
        });
        
    const decodedResponse = await apiResponse.json();

    return decodedResponse;
}

/**
 * API Put method
 * @param {object} params 
 * @property {string} route
 * @property {object} body
 * @property {object} headers
 */
export const put = async (params) => {
    const apiResponse = await fetch(params.route,
        {
            headers: params.headers,
            method: 'PUT',
            body: params.body
        });
        
    const decodedResponse = await apiResponse.json();

    return decodedResponse;
}