import addressData from '../data/addressData';


const addAddress = async (address) => {
    let res = await addressData.addAddress(address);
    return res;
}

export default {
    addAddress,
}