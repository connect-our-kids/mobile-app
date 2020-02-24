// import * as Crypto from 'expo-crypto';
// import * as Random from 'expo-random';

// // const base64URLEncode = (str) => {
// //     str.toString('base64')
// //         .replace(/\+/g, '-')
// //         .replace(/\//g, '_')
// //         .replace(/=/g, '')
// //         .then(res => {
// //             return res;
// //         })
// // }

// const getRandom = async () => await Random.getRandomBytesAsync(32).then(res => {
//     // console.log(res)
//     return JSON.stringify(res)
// });
// export const verifier = getRandom().then(res => {
//     // console.log('verifier', res)
//     return JSON.stringify(res)
// })
// // console.log('verifier', verifier)


// const sha256 = async (buffer) => {
//     await Crypto.digestStringAsync(
//         Crypto.CryptoDigestAlgorithm.SHA256,
//         toString(buffer),
//         CryptoDigestOptions = {encoding: Crypto.CryptoEncoding.BASE64}
//     )
//     .then(res => {
//         // console.log(res)
//         return JSON.stringify(res)
//     })
// }

// const getChallenge = async () => {
//     await sha256(verifier).then(res => {
//         // console.log(res)
//         return JSON.stringify(res)
//     })
// }
// export const challenge = getChallenge().then(res => {
//     // console.log('challenge', res)
//     return JSON.stringify(res)
// })


// // const getRandom = () => {
// //     Random.getRandomBytesAsync(32)
// //     .then(res => {
// //         // console.log('getRandomStr', res)
// //         return toString(res);
// //     })

// // }
// // // getRandom()

// // const digest = () => {
// //     const string = getRandom()
// //     console.log(string)
// //     Crypto.digestStringAsync(
// //         Crypto.CryptoDigestAlgorithm.SHA256,
// //         string,
// //         Crypto.CryptoEncoding.HEX
// //     )
// //     .then(res => {
// //         // console.log('digest', res)
// //         return toString(res);
// //     })
// // }
// // // digest()

// // export const verifier = getRandom();
// // export const challenge = digest();
// // console.log('challenge', challenge)
