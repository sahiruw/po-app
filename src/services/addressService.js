import addressData from '../data/addressData';


const addAddress = async (address) => {
    let res = await addressData.addAddress(address);
    console.log("addAddress", res);
    return res;
}

export default {
    addAddress,
}